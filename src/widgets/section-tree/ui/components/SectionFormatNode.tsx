import { useState } from 'react'
import { TagBadge } from '../../../../shared/ui/TagBadge'
import { SectionChannelNode } from './SectionChannelNode'
import type { SectionFormat } from '../../../../entities/frame/model/types'

/**
 * Collapsible format-level node in the section tree (e.g. JPG, PNG).
 * Sticky header with `TagBadge`; expands to show `SectionChannelNode` children.
 * Styling matches the resize-limits tree format headers.
 * @param root0
 * @param root0.fmt
 * @param root0.visibleChannels
 * @param root0.matches
 * @param root0.onPlace
 * @param root0.selectedCount
 */
export function SectionFormatNode({
  fmt,
  visibleChannels,
  matches,
  onPlace,
  selectedCount,
}: {
  fmt: SectionFormat
  visibleChannels: SectionFormat['channels']
  matches: (s: string) => boolean
  onPlace: (fmt: string, ch: string, pl: string, cr: string) => void
  selectedCount: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <div>
      <div
        class="tree-header"
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          margin: '0 -4px',
          padding: '3px 12px',
          borderRadius: 0,
          background: hovered ? 'var(--figma-color-bg-hover)' : 'var(--figma-color-bg)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: 'var(--figma-color-text-tertiary)',
            transform: collapsed ? 'rotate(-90deg)' : 'none',
            display: 'inline-block',
            width: 10,
            transition: 'transform 0.12s',
          }}
        >
          ▼
        </span>
        <TagBadge format={fmt.name.toLowerCase()} />
        <span style={{ fontWeight: 600, fontSize: 12, marginLeft: 2 }}>{fmt.name}</span>
      </div>
      {!collapsed &&
        visibleChannels.map((ch) => (
          <SectionChannelNode
            key={ch.name}
            ch={ch}
            formatName={fmt.name}
            matches={matches}
            onPlace={onPlace}
            selectedCount={selectedCount}
          />
        ))}
    </div>
  )
}
