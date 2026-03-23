import { useState } from 'react'
import { Textbox } from '@create-figma-plugin/ui'
import { ComboboxDropdown } from '../../../../shared/ui/ComboboxDropdown'

/**
 * Labeled text input with an autocomplete dropdown for a single path segment (format, channel, platform, or creative).
 * On focus shows all available options; filters as user types.
 * Dropdown closes on blur with a 150ms delay to allow click events on options to register first.
 * `onSelect` fires when an option is picked from the dropdown (for cascade resets in parent);
 * `onChange` fires on every keystroke (just updates the displayed text).
 * @param root0
 * @param root0.label
 * @param root0.value
 * @param root0.onChange
 * @param root0.onSelect
 * @param root0.options
 * @param root0.placeholder
 */
export function PathField({
  label,
  value,
  onChange,
  onSelect,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onSelect?: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)

  // Filter only when user has typed something that doesn't match an option exactly
  const isExactMatch = options.some((o) => o.toLowerCase() === value.toLowerCase())
  const visibleOptions =
    open && value && !isExactMatch
      ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
      : options

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
      <div class="path-field-input" style={{ flex: 1, position: 'relative' }}>
        <Textbox
          value={value}
          placeholder={placeholder}
          onValueInput={onChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && visibleOptions.length > 0 && (
          <ComboboxDropdown
            options={visibleOptions}
            onSelect={(o) => {
              onChange(o)
              onSelect?.(o)
              setOpen(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
