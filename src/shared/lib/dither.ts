/**
 * Generic dithering utilities shared by GIF, PNG, and JPG/WebP compression pipelines.
 *
 * Each algorithm accepts a `QuantizeFn` callback that maps an (r, g, b, alpha) pixel
 * to the nearest quantized [r, g, b] triple.  This makes the same diffusion kernels
 * reusable across:
 *   - GIF:     palette-based lookup via `Finder.findNearestIndex`
 *   - PNG:     uniform per-channel quantization to `levels` steps
 *   - JPG/WebP: uniform per-channel quantization at a fixed mild level
 */

/**
 * Maps a pixel's (r, g, b, alpha) values to the nearest quantized [r, g, b] triple.
 * Alpha is passed through for transparency-aware quantizers (e.g. palette finders)
 * but may be ignored by simpler channel-based quantizers.
 */
export type QuantizeFn = (
  r: number,
  g: number,
  b: number,
  alpha: number,
) => readonly [number, number, number]

import type { DitherMethod } from '../config'
export type { DitherMethod }

/**
 * All dithering methods, ordered by perceptual quality (best last).
 * Bayer leads because it produces temporally stable patterns across animation frames;
 * JJN trails because its wider diffusion kernel gives the smoothest gradients.
 * Ties in a multi-algorithm search are broken in favour of the last entry (JJN).
 */
export const DITHER_METHODS: readonly DitherMethod[] = [
  'bayer',
  'floyd-steinberg',
  'jarvis-judice-ninke',
]

/** 4×4 Bayer ordered-dithering threshold matrix (values 0–15). */
const BAYER_4X4: readonly (readonly number[])[] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]
const BAYER_HALF = 7.5
const BAYER_SCALE = 32

/**
 * Applies Bayer ordered dithering to raw RGBA pixel data.
 * Each pixel's RGB channels are shifted by a position-dependent threshold before
 * the quantize lookup.  The pattern is identical for every frame at the same (x, y),
 * so static areas of an animation never flicker.
 * Returns a new Uint8ClampedArray — the original is not modified.
 * @param pixels - Source RGBA pixel data (4 bytes per pixel, row-major).
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @param quantize - Function mapping an input pixel to its quantized RGB triple.
 * @returns Dithered RGBA pixel data.
 */
export function applyBayerDithering(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  quantize: QuantizeFn,
): Uint8ClampedArray {
  const result = new Uint8ClampedArray(pixels)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4
      // Map 0–15 matrix value to a symmetric offset centred on zero.
      const offset = ((BAYER_4X4[y % 4][x % 4] - BAYER_HALF) * BAYER_SCALE) / 16
      const r = Math.max(0, Math.min(255, result[pi] + offset))
      const g = Math.max(0, Math.min(255, result[pi + 1] + offset))
      const b = Math.max(0, Math.min(255, result[pi + 2] + offset))
      const [pr, pg, pb] = quantize(r, g, b, result[pi + 3])
      result[pi] = pr
      result[pi + 1] = pg
      result[pi + 2] = pb
    }
  }

  return result
}

/**
 * Applies Floyd-Steinberg error-diffusion dithering to raw RGBA pixel data.
 * Quantisation error is spread to four neighbours: right (7/16), bottom-left (3/16),
 * bottom (5/16), bottom-right (1/16).
 * Returns a new Uint8ClampedArray — the original is not modified.
 * @param pixels - Source RGBA pixel data (4 bytes per pixel, row-major).
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @param quantize - Function mapping an input pixel to its quantized RGB triple.
 * @returns Dithered RGBA pixel data.
 */
export function applyFloydSteinbergDithering(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  quantize: QuantizeFn,
): Uint8ClampedArray {
  const result = new Uint8ClampedArray(pixels)
  const errors = new Float32Array(width * height * 3)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4
      const ei = (y * width + x) * 3

      const r = Math.max(0, Math.min(255, result[pi] + errors[ei]))
      const g = Math.max(0, Math.min(255, result[pi + 1] + errors[ei + 1]))
      const b = Math.max(0, Math.min(255, result[pi + 2] + errors[ei + 2]))
      const [pr, pg, pb] = quantize(r, g, b, result[pi + 3])
      result[pi] = pr
      result[pi + 1] = pg
      result[pi + 2] = pb

      const er = r - pr,
        eg = g - pg,
        eb = b - pb

      if (x + 1 < width) {
        const i = (y * width + x + 1) * 3
        errors[i] += (er * 7) / 16
        errors[i + 1] += (eg * 7) / 16
        errors[i + 2] += (eb * 7) / 16
      }
      if (y + 1 < height) {
        if (x > 0) {
          const i = ((y + 1) * width + x - 1) * 3
          errors[i] += (er * 3) / 16
          errors[i + 1] += (eg * 3) / 16
          errors[i + 2] += (eb * 3) / 16
        }
        const i = ((y + 1) * width + x) * 3
        errors[i] += (er * 5) / 16
        errors[i + 1] += (eg * 5) / 16
        errors[i + 2] += (eb * 5) / 16
        if (x + 1 < width) {
          const i2 = ((y + 1) * width + x + 1) * 3
          errors[i2] += er / 16
          errors[i2 + 1] += eg / 16
          errors[i2 + 2] += eb / 16
        }
      }
    }
  }

  return result
}

/**
 * Applies Jarvis-Judice-Ninke error-diffusion dithering to raw RGBA pixel data.
 * Error is spread to 12 neighbours in two rows with weights summing to 48,
 * producing smoother gradients than Floyd-Steinberg.  Distribution:
 *
 *           X   7   5
 *   3   5   7   5   3
 *   1   3   5   3   1   (÷ 48)
 *
 * Returns a new Uint8ClampedArray — the original is not modified.
 * @param pixels - Source RGBA pixel data (4 bytes per pixel, row-major).
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @param quantize - Function mapping an input pixel to its quantized RGB triple.
 * @returns Dithered RGBA pixel data.
 */
export function applyJarvisJudiceNinkeDithering(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  quantize: QuantizeFn,
): Uint8ClampedArray {
  const result = new Uint8ClampedArray(pixels)
  const errors = new Float32Array(width * height * 3)

  /**
   * Adds a fraction of the current pixel's error to neighbour (nx, ny).
   * @param nx - Neighbour X coordinate.
   * @param ny - Neighbour Y coordinate.
   * @param er - Red channel error.
   * @param eg - Green channel error.
   * @param eb - Blue channel error.
   * @param weight - Diffusion weight (out of 48).
   */
  function diffuse(nx: number, ny: number, er: number, eg: number, eb: number, weight: number) {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) return
    const i = (ny * width + nx) * 3
    errors[i] += (er * weight) / 48
    errors[i + 1] += (eg * weight) / 48
    errors[i + 2] += (eb * weight) / 48
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4
      const ei = (y * width + x) * 3

      const r = Math.max(0, Math.min(255, result[pi] + errors[ei]))
      const g = Math.max(0, Math.min(255, result[pi + 1] + errors[ei + 1]))
      const b = Math.max(0, Math.min(255, result[pi + 2] + errors[ei + 2]))
      const [pr, pg, pb] = quantize(r, g, b, result[pi + 3])
      result[pi] = pr
      result[pi + 1] = pg
      result[pi + 2] = pb

      const er = r - pr,
        eg = g - pg,
        eb = b - pb

      diffuse(x + 1, y, er, eg, eb, 7)
      diffuse(x + 2, y, er, eg, eb, 5)
      diffuse(x - 2, y + 1, er, eg, eb, 3)
      diffuse(x - 1, y + 1, er, eg, eb, 5)
      diffuse(x, y + 1, er, eg, eb, 7)
      diffuse(x + 1, y + 1, er, eg, eb, 5)
      diffuse(x + 2, y + 1, er, eg, eb, 3)
      diffuse(x - 2, y + 2, er, eg, eb, 1)
      diffuse(x - 1, y + 2, er, eg, eb, 3)
      diffuse(x, y + 2, er, eg, eb, 5)
      diffuse(x + 1, y + 2, er, eg, eb, 3)
      diffuse(x + 2, y + 2, er, eg, eb, 1)
    }
  }

  return result
}

/**
 * Creates a quantize function that snaps each RGB channel to the nearest step
 * in a uniform grid of `levels` evenly-spaced values across [0, 255].
 * @param levels - Number of discrete values per channel (2 = only 0 and 255; 256 = lossless).
 * @returns A QuantizeFn suitable for use with any dithering algorithm.
 */
export function makeChannelQuantize(levels: number): QuantizeFn {
  const step = 255 / (levels - 1)
  const snap = (v: number) => Math.round(Math.round(v / step) * step)
  return (r, g, b) => [snap(r), snap(g), snap(b)] as const
}

/**
 * Applies the specified dithering algorithm to raw RGBA pixel data.
 * @param method - Which algorithm to use.
 * @param pixels - Source RGBA pixel data (4 bytes per pixel, row-major).
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @param quantize - Function mapping an input pixel to its quantized RGB triple.
 * @returns Dithered RGBA pixel data as a new Uint8ClampedArray.
 */
export function ditherPixels(
  method: DitherMethod,
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  quantize: QuantizeFn,
): Uint8ClampedArray {
  switch (method) {
    case 'bayer':
      return applyBayerDithering(pixels, width, height, quantize)
    case 'floyd-steinberg':
      return applyFloydSteinbergDithering(pixels, width, height, quantize)
    case 'jarvis-judice-ninke':
      return applyJarvisJudiceNinkeDithering(pixels, width, height, quantize)
  }
}
