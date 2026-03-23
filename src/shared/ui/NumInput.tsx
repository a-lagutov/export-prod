import { TextboxNumeric } from '@create-figma-plugin/ui'
import { PLACEHOLDER_ZERO } from '../config/strings'

/**
 * Numeric input wrapper around `TextboxNumeric` from `@create-figma-plugin/ui`.
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
    <div ref={containerRef}>
      <TextboxNumeric
        value={value}
        onValueInput={onChange}
        suffix={suffix}
        placeholder={PLACEHOLDER_ZERO}
        validateOnBlur={(v) => (v === null || v <= 0 ? null : v)}
      />
    </div>
  )
}
