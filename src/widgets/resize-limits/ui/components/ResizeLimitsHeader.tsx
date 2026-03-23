import { SegmentedControl } from '@create-figma-plugin/ui'
import { SearchInput } from '../../../../shared/ui/SearchInput'
import { LABEL_RESIZE_LIMITS } from '../../../../shared/config/strings'
import { TreeIcon, TableIcon } from './ViewToggleIcons'

/**
 * Fixed header for the `Resizes` sub-screen.
 * Contains a back arrow row (full-width clickable), tree/table toggle icons (absolute-positioned
 * above the back row to intercept clicks without propagation), and a search input.
 * @param root0
 * @param root0.view
 * @param root0.onViewChange
 * @param root0.search
 * @param root0.onSearch
 * @param root0.onBack
 */
export function ResizeLimitsHeader({
  view,
  onViewChange,
  search,
  onSearch,
  onBack,
}: {
  view: 'tree' | 'table'
  onViewChange: (v: 'tree' | 'table') => void
  search: string
  onSearch: (v: string) => void
  onBack: () => void
}) {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--figma-color-border)',
        background: 'var(--figma-color-bg)',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          class="back-row"
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}
        >
          <span
            style={{
              fontSize: 18,
              lineHeight: 1,
              color: 'var(--figma-color-text-secondary)',
              padding: '0 4px',
            }}
          >
            ←
          </span>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{LABEL_RESIZE_LIMITS}</span>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
        >
          <SegmentedControl
            value={view}
            options={[
              { value: 'tree', children: <TreeIcon /> },
              { value: 'table', children: <TableIcon /> },
            ]}
            onValueChange={onViewChange}
          />
        </div>
      </div>
      <div style={{ padding: '6px 12px 10px' }}>
        <SearchInput value={search} onValueInput={onSearch} />
      </div>
    </div>
  )
}
