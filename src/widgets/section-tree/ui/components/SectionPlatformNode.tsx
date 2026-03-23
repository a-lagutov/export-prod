import { useState } from 'react'
import { CreativeRow } from './CreativeRow'

/**
 * Collapsible platform-level node in the section tree. Expanded by default.
 * Expands to show `CreativeRow` children, filtered by the search query.
 * Returns null if no creatives match and the platform name itself does not match.
 * @param root0
 * @param root0.pl
 * @param root0.pl.name
 * @param root0.pl.creatives
 * @param root0.formatName
 * @param root0.chName
 * @param root0.matches
 * @param root0.onPlace
 * @param root0.selectedCount
 */
export function SectionPlatformNode({
  pl,
  formatName,
  chName,
  matches,
  onPlace,
  selectedCount,
}: {
  pl: { name: string; creatives: string[] }
  formatName: string
  chName: string
  matches: (s: string) => boolean
  onPlace: (fmt: string, ch: string, pl: string, cr: string) => void
  selectedCount: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  const visibleCreatives = pl.creatives.filter(
    (cr) => matches(chName) || matches(pl.name) || matches(cr),
  )
  if (visibleCreatives.length === 0 && !matches(pl.name)) return null
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
        <span style={{ fontSize: 12, color: 'var(--figma-color-text)' }}>{pl.name}</span>
      </div>
      {!collapsed &&
        visibleCreatives.map((cr) => (
          <CreativeRow
            key={cr}
            name={cr}
            onAdd={() => onPlace(formatName, chName, pl.name, cr)}
            enabled={selectedCount > 0}
          />
        ))}
    </div>
  )
}
