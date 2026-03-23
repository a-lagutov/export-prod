import { useState } from 'react'
import { TagBadge } from './TagBadge'

/**
 * Shared flat table row for both resize-limits and section-add table views.
 * Columns: Формат (badge) | Канал | Площадка | Креатив | [extraCell] | [lastCell].
 * Hover highlight is built in; clicking the row fires `onClick` if provided.
 * @param root0
 * @param root0.format
 * @param root0.channel
 * @param root0.platform
 * @param root0.creative
 * @param root0.extraCell
 * @param root0.lastCell
 * @param root0.onClick
 */
export function FlatTableRow({
  format,
  channel,
  platform,
  creative,
  extraCell,
  lastCell,
  onClick,
}: {
  format: string
  channel: string
  platform: string
  creative: string
  extraCell?: React.ReactNode
  lastCell: React.ReactNode
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        background: hovered ? 'var(--figma-color-bg-hover)' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ width: 36, flexShrink: 0 }}>
        <TagBadge format={format.toLowerCase()} />
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 11,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--figma-color-text-secondary)',
        }}
      >
        {channel}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 11,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--figma-color-text-secondary)',
        }}
      >
        {platform}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 11,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--figma-color-text)',
        }}
      >
        {creative}
      </span>
      {extraCell}
      {lastCell}
    </div>
  )
}
