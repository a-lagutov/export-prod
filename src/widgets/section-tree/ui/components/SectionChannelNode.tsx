import { useState } from 'react'
import { SectionPlatformNode } from './SectionPlatformNode'

/**
 * Collapsible channel-level node in the section tree. Expanded by default.
 * Expands to show `SectionPlatformNode` children for each platform.
 * @param root0
 * @param root0.ch
 * @param root0.ch.name
 * @param root0.ch.platforms
 * @param root0.formatName
 * @param root0.matches
 * @param root0.onPlace
 * @param root0.selectedCount
 */
export function SectionChannelNode({
  ch,
  formatName,
  matches,
  onPlace,
  selectedCount,
}: {
  ch: { name: string; platforms: { name: string; creatives: string[] }[] }
  formatName: string
  matches: (s: string) => boolean
  onPlace: (fmt: string, ch: string, pl: string, cr: string) => void
  selectedCount: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ paddingLeft: 12 }}>
      <div
        class="tree-header"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 4px',
          borderRadius: 4,
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
        <span style={{ fontSize: 12, color: 'var(--figma-color-text)' }}>{ch.name}</span>
      </div>
      {!collapsed &&
        ch.platforms.map((pl) => (
          <SectionPlatformNode
            key={pl.name}
            pl={pl}
            formatName={formatName}
            chName={ch.name}
            matches={matches}
            onPlace={onPlace}
            selectedCount={selectedCount}
          />
        ))}
    </div>
  )
}
