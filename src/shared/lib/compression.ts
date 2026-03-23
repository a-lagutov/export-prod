import * as config from '../config/index'

export function pngBytesToCanvas(pngBytes: Uint8Array): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const blob = new Blob([pngBytes as BlobPart], { type: 'image/png' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      resolve(canvas)
    }
    img.src = url
  })
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), mimeType, quality)
  })
}

export async function binarySearchQuality(
  canvas: HTMLCanvasElement,
  mimeType: string,
  targetSize: number,
): Promise<Blob> {
  let lo = 0.0,
    hi = 1.0
  let best: Blob | null = null
  async function iterate(n: number): Promise<Blob> {
    if (n <= 0) return best ?? canvasToBlob(canvas, mimeType, 0)
    const mid = (lo + hi) / 2
    const blob = await canvasToBlob(canvas, mimeType, mid)
    if (blob.size <= targetSize) {
      best = blob
      lo = mid
    } else {
      hi = mid
    }
    return iterate(n - 1)
  }
  return iterate(config.JPG_SEARCH_ITERATIONS)
}

export async function compressPngToTarget(
  canvas: HTMLCanvasElement,
  targetSize: number,
): Promise<Blob> {
  const { width: w, height: h } = canvas
  const ctx = canvas.getContext('2d')!
  const orig = ctx.getImageData(0, 0, w, h)

  async function quantize(levels: number): Promise<Blob> {
    const tmp = document.createElement('canvas')
    tmp.width = w
    tmp.height = h
    const tCtx = tmp.getContext('2d')!
    const imgData = tCtx.createImageData(w, h)
    const src = orig.data,
      dst = imgData.data
    const step = 256 / levels
    for (let i = 0; i < src.length; i += 4) {
      dst[i] = Math.round(Math.round(src[i] / step) * step)
      dst[i + 1] = Math.round(Math.round(src[i + 1] / step) * step)
      dst[i + 2] = Math.round(Math.round(src[i + 2] / step) * step)
      dst[i + 3] = src[i + 3]
    }
    tCtx.putImageData(imgData, 0, 0)
    return canvasToBlob(tmp, 'image/png')
  }

  let lo = config.PNG_LEVELS_MIN,
    hi = config.PNG_LEVELS_MAX,
    best: Blob | null = null
  async function iterate(n: number): Promise<Blob> {
    if (n <= 0) return best ?? quantize(config.PNG_LEVELS_MIN)
    const mid = Math.floor((lo + hi) / 2)
    const blob = await quantize(mid)
    if (blob.size <= targetSize) {
      best = blob
      lo = mid + 1
    } else {
      hi = mid - 1
    }
    return iterate(n - 1)
  }
  return iterate(8)
}

export async function convertFrame(
  pngBytes: Uint8Array,
  format: string,
  limit: number | null,
): Promise<Blob> {
  const canvas = await pngBytesToCanvas(pngBytes)
  if (format === 'png') {
    return limit ? compressPngToTarget(canvas, limit) : canvasToBlob(canvas, 'image/png')
  }
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/webp'
  return limit ? binarySearchQuality(canvas, mimeType, limit) : canvasToBlob(canvas, mimeType, 1.0)
}
