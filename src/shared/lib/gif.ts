import GIF from 'gif.js'
import { pngBytesToCanvas } from './compression'

// gif.worker.js content injected at build time via esbuild define
declare const __GIF_WORKER_CONTENT__: string
let GIF_WORKER_URL: string | null = null

export function getGifWorkerUrl(): string {
  if (!GIF_WORKER_URL) {
    const blob = new Blob([__GIF_WORKER_CONTENT__], { type: 'application/javascript' })
    GIF_WORKER_URL = URL.createObjectURL(blob)
  }
  return GIF_WORKER_URL
}

export async function assembleGif(
  framesData: ArrayBuffer[],
  width: number,
  height: number,
  delay: number,
  limit: number | null,
): Promise<Blob> {
  const canvases = await Promise.all(framesData.map((f) => pngBytesToCanvas(new Uint8Array(f))))

  function renderGif(quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const gif = new GIF({ workers: 2, quality, width, height, workerScript: getGifWorkerUrl() })
      canvases.forEach((c) => gif.addFrame(c, { delay, copy: true }))
      gif.on('finished', resolve)
      gif.on('error', reject)
      gif.render()
    })
  }

  if (!limit) return renderGif(10)

  let lo = 1,
    hi = 30,
    best: Blob | null = null
  for (let i = 0; i < 6; i++) {
    const mid = Math.floor((lo + hi) / 2)
    const blob = await renderGif(mid)
    if (blob.size <= limit) {
      best = blob
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  return best ?? renderGif(30)
}
