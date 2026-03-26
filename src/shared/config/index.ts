// ── Plugin window ─────────────────────────────────────────────────────────────

export const WINDOW_WIDTH = 500
export const WINDOW_HEIGHT = 450
export const WINDOW_MIN_HEIGHT = 200

// ── Section layout (Place tab) ────────────────────────────────────────────────

/** Padding inside each section around its children */
export const SECTION_FIT_PADDING = 40

/** Internal padding and gap between frames when placing */
export const PLACE_PADDING = 250
export const FRAME_GAP = 250
export const GIF_SLIDE_GAP = 50

/** Horizontal distance between format sections on the canvas */
export const FORMAT_SECTION_GAP = 5000

/** Padding and gap used during section alignment */
export const ALIGN_PADDING = 250
export const ALIGN_GAP = 250
export const ALIGN_FORMAT_GAP = 5000

// ── Section fill opacities ────────────────────────────────────────────────────

export const FORMAT_SECTION_OPACITY = 0.2
export const CHANNEL_SECTION_OPACITY = 0.4
export const PLATFORM_SECTION_OPACITY = 0.6
export const CREATIVE_SECTION_OPACITY = 0.8

// ── Compression ───────────────────────────────────────────────────────────────

/** Available dithering algorithms. */
export type DitherMethod = 'floyd-steinberg' | 'jarvis-judice-ninke' | 'bayer'

/**
 * Dithering method to use during compression.
 * `'best'` — try all three algorithms and pick the one that achieves the highest
 * quality (maxColors for GIF, quantisation levels for PNG, largest blob for JPG/WebP).
 * Set to a specific method name to skip the multi-algorithm search and always
 * use that algorithm (faster export, useful when you know the best method from logs).
 */
export const DITHER_METHOD: DitherMethod | 'best' = 'jarvis-judice-ninke'

/** Number of binary search iterations for JPG/WebP quality */
export const JPG_SEARCH_ITERATIONS = 8

/**
 * When true, quality binary search runs on both the original and dithered versions;
 * the candidate producing the largest blob ≤ limit wins (original usually wins for JPG/WebP).
 * When false, dithering is always applied to frames that have a size limit — no comparison
 * with the original.
 */
export const JPG_DITHER_CANDIDATES = false

/**
 * Per-channel quantisation levels for the JPG/WebP dithering pre-processing step.
 * 64 levels ≈ 4-bit per channel — mild enough to be barely perceptible on its own,
 * sufficient to break up smooth gradients before DCT encoding.
 */
export const JPG_DITHER_LEVELS = 64

/** Number of binary search iterations for PNG quantization */
export const PNG_SEARCH_ITERATIONS = 8

/** PNG quantization levels range */
export const PNG_LEVELS_MIN = 2
export const PNG_LEVELS_MAX = 256

/**
 * When true, binary search runs for each dithering algorithm and the one achieving
 * the highest quantisation levels ≤ limit wins.
 * When false, DITHER_METHOD is applied directly — no multi-algorithm comparison.
 */
export const PNG_DITHER_CANDIDATES = false

/** Number of binary search iterations for GIF maxColors */
export const GIF_SEARCH_ITERATIONS = 6

/**
 * When true, binary search runs for each dithering algorithm and the one achieving
 * the highest maxColors ≤ limit wins.
 * When false, DITHER_METHOD is applied directly — no multi-algorithm comparison.
 */
export const GIF_DITHER_CANDIDATES = true

// ── GIF animation ─────────────────────────────────────────────────────────────

/** Default frame delay in seconds (shown in the UI input) */
export const GIF_DELAY_DEFAULT = '3'

/** Fallback delay in milliseconds if the input is invalid */
export const GIF_DELAY_FALLBACK_MS = 3000

// ── Formats ───────────────────────────────────────────────────────────────────

/** Supported export formats — defines valid top-level section names */
export const FORMATS = ['jpg', 'png', 'webp', 'gif'] as const
export type Format = (typeof FORMATS)[number]

// ── Misc ──────────────────────────────────────────────────────────────────────

/** Debounce delay before re-scanning after a document change */
export const RESCAN_DEBOUNCE_MS = 500

/** Export scale factor passed to the Figma export API */
export const EXPORT_SCALE = 1
