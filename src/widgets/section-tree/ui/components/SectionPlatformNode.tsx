import { CreativeRow } from './CreativeRow'

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
  const visibleCreatives = pl.creatives.filter(
    (cr) => matches(chName) || matches(pl.name) || matches(cr),
  )
  if (visibleCreatives.length === 0 && !matches(pl.name)) return null
  return (
    <div style={{ paddingLeft: 14 }}>
      <div
        style={{
          padding: '2px 0',
          color: 'var(--figma-color-text-secondary)',
          fontStyle: 'italic',
          fontSize: 10,
        }}
      >
        {pl.name}
      </div>
      {visibleCreatives.map((cr) => (
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
