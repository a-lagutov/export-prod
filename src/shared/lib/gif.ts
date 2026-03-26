import { encode } from 'modern-gif'
import { Finder, Palette } from 'modern-palette'
import type { QuantizedColor } from 'modern-palette'
import * as config from '../config'
import { pngBytesToCanvas } from './compression'
import * as logger from '../logger'
import { ditherPixels, DITHER_METHODS } from './dither'
import type { DitherMethod } from './dither'

/**
 * Assembles multiple PNG frames into a GIF animation, automatically selecting
 * the dithering algorithm and palette size that maximise visual quality within
 * the given file-size limit.
 *
 * Search strategy:
 *  For each dithering method (Bayer, Floyd-Steinberg, Jarvis-Judice-Ninke):
 *    1. Build a global palette from all frames via median-cut quantisation.
 *    2. Dither every frame against that palette using the given algorithm.
 *    3. Encode with modern-gif (pre-dithered pixels already match palette colours
 *       exactly, so findNearestIndex hits exact matches and preserves dithering).
 *    4. Binary-search over maxColors (2–255) to find the highest palette size
 *       whose encoded file fits within the size limit.
 *  Pick the candidate with the highest maxColors; ties broken by algorithm quality
 *  rank (JJN wins, as it is last in DITHER_METHODS).
 *  Bayer is included because it produces temporally stable patterns across frames
 *  (no inter-frame flicker in static areas of the animation).
 *
 * Encoding runs on the main thread (no Web Worker) to avoid Figma sandbox CSP
 * restrictions.
 * @param framesData - PNG frame data as ArrayBuffers, sorted left-to-right.
 * @param width - Output GIF width in pixels.
 * @param height - Output GIF height in pixels.
 * @param delay - Frame delay in milliseconds.
 * @param limit - Maximum file size in bytes, or null for no limit.
 * @returns The best GIF Blob found.
 */
export async function assembleGif(
  framesData: ArrayBuffer[],
  width: number,
  height: number,
  delay: number,
  limit: number | null,
): Promise<Blob> {
  const canvases = await Promise.all(framesData.map((f) => pngBytesToCanvas(new Uint8Array(f))))

  // Extract original pixel data once; binary-search iterations re-read from here.
  const originalFramePixels: Uint8ClampedArray[] = canvases.map((canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data
  })

  /**
   * Encodes all frames with the given palette size and dithering method.
   * Builds a fresh global palette on each call so iterations remain independent.
   * @param maxColors - Maximum palette colours (2–255); higher = better quality.
   * @param method - Dithering algorithm to apply.
   * @returns A GIF Blob encoded with the given palette size and dithering.
   */
  async function renderGif(maxColors: number, method: DitherMethod): Promise<Blob> {
    // Build a global palette by sampling every frame's original pixel data.
    const palette = new Palette({ maxColors })
    originalFramePixels.forEach((pixels) => palette.addSample(pixels as unknown as BufferSource))
    const colors: QuantizedColor[] = await palette.generate()

    const paletteColors = colors.map((color) => [color.rgb.r, color.rgb.g, color.rgb.b])
    const finder = new Finder(colors)

    // Quantize function: palette nearest-colour lookup via Finder.
    const paletteQuantize = (r: number, g: number, b: number, alpha: number) => {
      const idx = finder.findNearestIndex(r, g, b, alpha)
      return paletteColors[idx] as readonly [number, number, number]
    }

    // Dither each frame and place it on a new canvas for modern-gif.
    // Because pixels are already snapped to palette colours, modern-gif's internal
    // findNearestIndex finds exact matches and preserves the dithering perfectly.
    const ditheredFrames = originalFramePixels.map((pixels) => {
      const dithered = ditherPixels(method, pixels, width, height, paletteQuantize)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas
        .getContext('2d', { willReadFrequently: true })!
        .putImageData(new ImageData(dithered, width, height), 0, 0)
      return canvas
    })

    return encode({
      width,
      height,
      maxColors,
      frames: ditheredFrames.map((canvas) => ({ data: canvas, delay })),
      format: 'blob',
    })
  }

  // No limit: use maximum palette with the highest-quality dithering method.
  if (!limit) return renderGif(255, 'jarvis-judice-ninke')

  // With a size limit: run a binary search per dithering method and keep the
  // candidate that achieves the highest maxColors.  Ties are broken in favour
  // of the method listed later in DITHER_METHODS (Jarvis-Judice-Ninke wins).
  // Candidates mode: try all methods (or just one if DITHER_METHOD is fixed).
  // Fixed mode: always use DITHER_METHOD directly — no multi-algorithm comparison.
  const methodsToTry = config.GIF_DITHER_CANDIDATES
    ? config.DITHER_METHOD === 'best'
      ? DITHER_METHODS
      : [config.DITHER_METHOD]
    : [config.DITHER_METHOD === 'best' ? 'jarvis-judice-ninke' : config.DITHER_METHOD]

  let bestBlob: Blob | null = null
  let bestMaxColors = 0
  let bestMethod: DitherMethod | null = null

  for (const method of methodsToTry) {
    let lo = 2,
      hi = 255,
      methodBestBlob: Blob | null = null,
      methodBestColors = 0

    for (let i = 0; i < config.GIF_SEARCH_ITERATIONS; i++) {
      const mid = Math.floor((lo + hi) / 2)
      const blob = await renderGif(mid, method)
      if (blob.size <= limit) {
        methodBestBlob = blob
        methodBestColors = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }

    if (methodBestBlob && methodBestColors >= bestMaxColors) {
      bestBlob = methodBestBlob
      bestMaxColors = methodBestColors
      bestMethod = method
    }
  }

  logger.log(
    `gif compress: method=${bestMethod ?? 'none'} maxColors=${bestMaxColors}/255 size=${bestBlob?.size ?? 0}/${limit}`,
  )

  return bestBlob ?? renderGif(2, 'floyd-steinberg')
}
