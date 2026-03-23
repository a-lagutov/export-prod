import { useRef } from 'react'
import { Text } from '@create-figma-plugin/ui'
import { NumInput } from '../../../../shared/ui/NumInput'
import { tooltipExportPlatform, SUFFIX_MB } from '../../../../shared/config/strings'

/**
 * Row for setting the size limit for a specific format + platform combination.
 * Contains a platform-filtered export button, the platform name, and a numeric limit input.
 * Clicking anywhere on the row focuses the input.
 * @param root0
 * @param root0.name
 * @param root0.format
 * @param root0.value
 * @param root0.onChange
 * @param root0.isExporting
 * @param root0.onExport
 */
export function PlatformRow({
  name,
  format,
  value,
  onChange,
  isExporting,
  onExport,
}: {
  name: string
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
        gap: 8,
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
        title={tooltipExportPlatform(format.toUpperCase(), name)}
        style={{
          width: 22,
          height: 22,
          padding: 0,
          fontSize: 12,
          border: '1px solid var(--figma-color-border)',
          borderRadius: 4,
          background: 'var(--figma-color-bg-secondary)',
          color: isExporting ? 'var(--figma-color-text-disabled)' : 'var(--figma-color-text)',
          cursor: isExporting ? 'default' : 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ↓
      </button>
      <div style={{ flex: 1 }}>
        <Text>{name}</Text>
      </div>
      <NumInput value={value} onChange={onChange} suffix={SUFFIX_MB} containerRef={containerRef} />
    </div>
  )
}
