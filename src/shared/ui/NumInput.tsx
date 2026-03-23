import { TextboxNumeric } from '@create-figma-plugin/ui'

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
        variant="border"
        value={value}
        onValueInput={onChange}
        suffix={suffix}
        placeholder="0"
        validateOnBlur={(v) => (v === null || v <= 0 ? null : v)}
      />
    </div>
  )
}
