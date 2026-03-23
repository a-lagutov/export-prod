import { useState } from 'react'
import { Textbox } from '@create-figma-plugin/ui'
import { ComboboxDropdown } from '../../../../shared/ui/ComboboxDropdown'

export function PathField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const filtered = options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          width: 72,
          fontSize: 11,
          color: 'var(--figma-color-text-secondary)',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, position: 'relative' }}>
        <Textbox
          variant="border"
          value={value}
          placeholder={placeholder}
          onValueInput={onChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && filtered.length > 0 && (
          <ComboboxDropdown
            options={filtered}
            onSelect={(o) => {
              onChange(o)
              setOpen(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
