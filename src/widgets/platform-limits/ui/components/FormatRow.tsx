import { useRef } from 'react'
import { TagBadge } from '../../../../shared/ui/TagBadge'
import { NumInput } from '../../../../shared/ui/NumInput'
import { tooltipExportFormat, SUFFIX_MB } from '../../../../shared/config/strings'

/**
 * Row for setting the default size limit for all platforms within a given format.
 * Contains a format-only export button, a `TagBadge`, and a numeric limit input.
 * Clicking anywhere on the row focuses the input.
 * @param root0
 * @param root0.format
 * @param root0.value
 * @param root0.onChange
 * @param root0.isExporting
 * @param root0.onExport
 */
export function FormatRow({
  format,
  value,
  onChange,
  isExporting,
  onExport,
}: {
  format: string
  value: string
  onChange: (v: string) => void
  isExporting: boolean
  onExport: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div
      class="limit-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
        padding: '2px 4px',
        cursor: 'default',
      }}
      onClick={() => containerRef.current?.querySelector('input')?.focus()}
    >
      <button
        class="btn-icon"
        onClick={(e) => {
          e.stopPropagation()
          if (!isExporting) onExport()
        }}
        disabled={isExporting}
        title={tooltipExportFormat(format.toUpperCase())}
        style={{
          padding: '2px 8px',
          fontSize: 10,
          border: '1px solid var(--figma-color-border)',
          borderRadius: 4,
          background: 'var(--figma-color-bg-secondary)',
          color: isExporting ? 'var(--figma-color-text-disabled)' : 'var(--figma-color-text)',
          cursor: isExporting ? 'default' : 'pointer',
          flexShrink: 0,
        }}
      >
        ↓
      </button>
      <TagBadge format={format} />
      <div style={{ flex: 1 }} />
      <NumInput value={value} onChange={onChange} suffix={SUFFIX_MB} containerRef={containerRef} />
    </div>
  )
}
