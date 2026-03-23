import { useRef } from 'react'
import { NumInput } from '../../../../shared/ui/NumInput'
import { FlatTableRow } from '../../../../shared/ui/FlatTableRow'
import { SUFFIX_MB } from '../../../../shared/config/strings'
import type { FlatRow } from '../../../../entities/frame/model/tree'

/**
 * A single row in the resize-limits table view.
 * Uses the shared `FlatTableRow` layout; last cell is a numeric weight-limit input.
 * Clicking the row focuses the input.
 * @param root0
 * @param root0.row
 * @param root0.frameSizes
 * @param root0.onFrameSizeChange
 */
export function TableRow({
  row,
  frameSizes,
  onFrameSizeChange,
}: {
  row: FlatRow
  frameSizes: Record<string, string>
  onFrameSizeChange: (key: string, value: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <FlatTableRow
      format={row.formatTag}
      channel={row.channel}
      platform={row.platform}
      creative={row.creative}
      onClick={() => containerRef.current?.querySelector('input')?.focus()}
      extraCell={
        <span
          style={{ width: 72, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <span style={{ fontSize: 11, color: 'var(--figma-color-text-secondary)' }}>
            {row.frameName}
          </span>
          {row.gifFrameInfo && (
            <span style={{ fontSize: 10, color: 'var(--figma-color-text-tertiary)' }}>
              {row.gifFrameInfo}
            </span>
          )}
        </span>
      }
      lastCell={
        <div style={{ flexShrink: 0, width: 72 }}>
          <NumInput
            value={frameSizes[row.key] ?? ''}
            onChange={(v) => onFrameSizeChange(row.key, v)}
            suffix={SUFFIX_MB}
            containerRef={containerRef}
          />
        </div>
      }
    />
  )
}
