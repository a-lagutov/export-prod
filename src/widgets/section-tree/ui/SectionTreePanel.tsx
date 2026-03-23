import { Fragment, useState, useMemo } from 'react'
import { SegmentedControl, Text, VerticalSpace, IconWarning16 } from '@create-figma-plugin/ui'
import { SearchInput } from '../../../shared/ui/SearchInput'
import { LABEL_ADD_TO_SECTION, MSG_SELECT_FRAMES } from '../../../shared/config/strings'
import { SectionTree } from './components/SectionTree'
import { SectionTableHeader } from './components/SectionTableHeader'
import { SectionTableRow } from './components/SectionTableRow'
import { TreeIcon, TableIcon } from '../../resize-limits/ui/components/ViewToggleIcons'
import type { SectionFormat } from '../../../entities/frame/model/types'

/** Flat row derived from the section hierarchy for the table view. */
interface SectionFlatRow {
  format: string
  channel: string
  platform: string
  creative: string
}

/**
 * Flattens the nested section hierarchy into a list of creative rows.
 * @param sections
 */
function flattenSections(sections: SectionFormat[]): SectionFlatRow[] {
  const rows: SectionFlatRow[] = []
  for (const fmt of sections) {
    for (const ch of fmt.channels) {
      for (const pl of ch.platforms) {
        for (const cr of pl.creatives) {
          rows.push({ format: fmt.name, channel: ch.name, platform: pl.name, creative: cr })
        }
      }
    }
  }
  return rows
}

/**
 * Panel displaying existing sections on the page with a search input and quick-add buttons.
 * Supports tree and table view with headers, toggled via icon buttons.
 * When `inline` is true the scroll container fills available space (used as a full tab);
 * otherwise it is capped at 220 px (used embedded below the fields form).
 * @param root0
 * @param root0.sections
 * @param root0.onPlace
 * @param root0.selectedCount
 * @param root0.inline
 */
export function SectionTreePanel({
  sections,
  onPlace,
  selectedCount,
  inline = false,
}: {
  sections: SectionFormat[]
  onPlace: (fmt: string, ch: string, pl: string, cr: string) => void
  selectedCount: number
  inline?: boolean
}) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'tree' | 'table'>('tree')

  const allRows = useMemo(() => flattenSections(sections), [sections])
  const q = query.toLowerCase()
  const filteredRows = useMemo(
    () =>
      q
        ? allRows.filter(
            (r) =>
              r.format.toLowerCase().includes(q) ||
              r.channel.toLowerCase().includes(q) ||
              r.platform.toLowerCase().includes(q) ||
              r.creative.toLowerCase().includes(q),
          )
        : allRows,
    [allRows, q],
  )

  const scrollStyle = inline
    ? { flex: 1, overflowY: 'auto' as const, minHeight: 0 }
    : { maxHeight: 220, overflowY: 'auto' as const }

  const containerStyle = inline
    ? { display: 'flex', flexDirection: 'column' as const, height: '100%' }
    : {}

  return (
    <div style={containerStyle}>
      {/* Header row: label + view toggle */}
      {!inline && (
        <Fragment>
          <VerticalSpace space="small" />
          <Text>
            <strong>{LABEL_ADD_TO_SECTION}</strong>
          </Text>
          <VerticalSpace space="extraSmall" />
        </Fragment>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
          padding: inline ? '0 12px' : 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <SearchInput value={query} onValueInput={setQuery} />
        </div>
        <SegmentedControl
          value={view}
          options={[
            { value: 'tree', children: <TreeIcon /> },
            { value: 'table', children: <TableIcon /> },
          ]}
          onValueChange={setView}
        />
      </div>

      {/* Shared scroll container — same size and separator for both views */}
      <div
        style={{
          ...scrollStyle,
          borderTop: '1px solid var(--figma-color-border)',
          fontSize: 11,
          padding: view === 'tree' ? '0 0 4px 0' : 0,
        }}
      >
        {view === 'tree' && (
          <SectionTree
            sections={sections}
            searchQuery={query}
            onPlace={onPlace}
            selectedCount={selectedCount}
          />
        )}
        {view === 'table' && (
          <>
            <SectionTableHeader />
            {filteredRows.map((row, i) => (
              <SectionTableRow
                key={i}
                format={row.format}
                channel={row.channel}
                platform={row.platform}
                creative={row.creative}
                onAdd={() => onPlace(row.format, row.channel, row.platform, row.creative)}
                enabled={selectedCount > 0}
              />
            ))}
          </>
        )}
      </div>

      {/* Warning bar shown in inline (sections tab) mode when no frames are selected */}
      {inline && selectedCount === 0 && (
        <div
          style={{
            padding: '12px 16px 16px',
            background: 'var(--figma-color-bg)',
            borderTop: '1px solid var(--figma-color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 16px',
              borderRadius: 'var(--border-radius-6)',
              background: 'var(--figma-color-bg-warning)',
              fontSize: 13,
            }}
          >
            <span style={{ color: 'var(--figma-color-icon-onwarning)', display: 'flex' }}>
              <IconWarning16 />
            </span>
            <span style={{ color: 'var(--figma-color-text-onwarning)' }}>{MSG_SELECT_FRAMES}</span>
          </div>
        </div>
      )}
    </div>
  )
}
