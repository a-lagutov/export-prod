import { TextboxNumeric } from '@create-figma-plugin/ui'
import { PLACEHOLDER_ZERO } from '../config/strings'

/**
 * Numeric input wrapper around `TextboxNumeric` from `@create-figma-plugin/ui`.
 * Renders an optional suffix label (e.g. "МБ", "сек") as an absolutely positioned
 * element inside the input, matching the native Figma color-input "%" style.
 * Accepts a `containerRef` so callers can programmatically focus the inner input
 * via `containerRef.current?.querySelector('input')?.focus()`.
 * Validates on blur — rejects zero and negative values.
 * @param root0
 * @param root0.value
 * @param root0.onChange
 * @param root0.suffix
 * @param root0.containerRef
 * @param root0.containerRef.current
 */
export function NumInput({
  value,
  onChange,
  suffix,
  containerRef,
}: {
  value: string
  onChange: (v: string) => void
  suffix?: string
  containerRef?: { current: HTMLDivElement | null }
}) {
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div class={suffix ? 'num-input-suffix' : undefined}>
        <TextboxNumeric
          value={value}
          onValueInput={onChange}
          placeholder={PLACEHOLDER_ZERO}
          validateOnBlur={(v) => (v === null || v <= 0 ? null : v)}
        />
      </div>
      {suffix && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            right: 6,
            transform: 'translateY(-50%)',
            fontSize: 11,
            color: 'var(--figma-color-text-tertiary)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}
