import { FlatTableHeader } from '../../../../shared/ui/FlatTableHeader'
import { HEADER_LIMIT, HEADER_SIZE } from '../../../../shared/config/strings'

/** Sticky column header for the resize-limits table view. Extra column: frame size. Last column: weight limit. */
export function TableHeader() {
  return (
    <FlatTableHeader
      extraCell={
        <span
          style={{
            width: 72,
            fontSize: 10,
            color: 'var(--figma-color-text-tertiary)',
            flexShrink: 0,
          }}
        >
          {HEADER_SIZE}
        </span>
      }
      lastCell={
        <span
          style={{
            width: 72,
            fontSize: 10,
            color: 'var(--figma-color-text-tertiary)',
            flexShrink: 0,
            textAlign: 'right',
          }}
        >
          {HEADER_LIMIT}
        </span>
      }
    />
  )
}
