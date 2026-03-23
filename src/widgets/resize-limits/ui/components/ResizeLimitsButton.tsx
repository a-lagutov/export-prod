import { declension } from '../../../../shared/lib/declension'
import { LABEL_RESIZES, DECLENSION_FILE } from '../../../../shared/config/strings'

/**
 * Navigation button on the main export screen that opens the `Resizes` sub-screen.
 * Accepts hover/pressed state as props (instead of CSS classes) because inline `background`
 * would override CSS `:hover` rules.
 * @param root0
 * @param root0.count
 * @param root0.hovered
 * @param root0.pressed
 * @param root0.onClick
 * @param root0.onMouseEnter
 * @param root0.onMouseLeave
 * @param root0.onMouseDown
 * @param root0.onMouseUp
 */
export function ResizeLimitsButton({
  count,
  hovered,
  pressed,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  count: number
  hovered: boolean
  pressed: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseDown: () => void
  onMouseUp: () => void
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        border: '1px solid var(--figma-color-border)',
        borderRadius: 6,
        background: pressed
          ? 'var(--figma-color-bg-selected)'
          : hovered
            ? 'var(--figma-color-bg-tertiary)'
            : 'var(--figma-color-bg-secondary)',
        color: 'var(--figma-color-text)',
        fontSize: 12,
        cursor: 'pointer',
        marginBottom: 0,
      }}
    >
      <span style={{ fontWeight: 600 }}>{LABEL_RESIZES}</span>
      <span style={{ color: 'var(--figma-color-text-tertiary)', fontSize: 11 }}>
        {count} {declension(count, ...DECLENSION_FILE)} ›
      </span>
    </button>
  )
}
