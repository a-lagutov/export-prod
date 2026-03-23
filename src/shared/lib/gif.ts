import { encode } from 'modern-gif'
import { pngBytesToCanvas } from './compression'

/**
 * Assembles multiple PNG frames into a GIF animation, applying size compression if needed.
 * If a size limit is set, uses binary search over maxColors (2–255, higher = better quality)
 * to find the highest quality that fits within the limit.
 * Encoding runs on the main thread (no Web Worker) to avoid Figma sandbox CSP restrictions.
 * @param framesData - Array of PNG frame data as ArrayBuffers, sorted left-to-right.
 * @param width - Output GIF width in pixels.
 * @param height - Output GIF height in pixels.
 * @param delay - Frame delay in milliseconds.
 * @param limit - Maximum file size in bytes, or null for no limit.
 * @returns A GIF Blob.
 */
export async function assembleGif(
  framesData: ArrayBuffer[],
  width: number,
  height: number,
  delay: number,
  limit: number | null,
): Promise<Blob> {
  const canvases = await Promise.all(framesData.map((f) => pngBytesToCanvas(new Uint8Array(f))))

  /**
   * Encodes frames into a GIF Blob with the given maxColors palette size.
   * @param maxColors
   */
  function renderGif(maxColors: number): Promise<Blob> {
    return encode({
      width,
      height,
      maxColors,
      frames: canvases.map((canvas) => ({ data: canvas, delay })),
      format: 'blob',
    })
  }

  if (!limit) return renderGif(255)

  // Binary search: find highest maxColors (best quality) that still fits within the size limit.
  let lo = 2,
    hi = 255,
    best: Blob | null = null
  for (let i = 0; i < 6; i++) {
    const mid = Math.floor((lo + hi) / 2)
    const blob = await renderGif(mid)
    if (blob.size <= limit) {
      best = blob
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return best ?? renderGif(2)
}
