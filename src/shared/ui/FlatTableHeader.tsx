import { LABEL_FORMAT, LABEL_CHANNEL, LABEL_PLATFORM, LABEL_CREATIVE } from '../config/strings'

/**
 * Shared sticky column header for flat table views.
 * Columns: Формат | Канал | Площадка | Креатив | [extraCell] | [lastCell].
 * @param root0
 * @param root0.lastCell
 * @param root0.extraCell
 */
export function FlatTableHeader({
  lastCell,
  extraCell,
}: {
  lastCell?: React.ReactNode
  extraCell?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        position: 'sticky',
        top: 0,
        background: 'var(--figma-color-bg)',
        zIndex: 10,
        borderBottom: '1px solid var(--figma-color-border)',
      }}
    >
      <span
        style={{
          width: 36,
          fontSize: 10,
          color: 'var(--figma-color-text-tertiary)',
          flexShrink: 0,
        }}
      >
        {LABEL_FORMAT}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 10,
          color: 'var(--figma-color-text-tertiary)',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {LABEL_CHANNEL}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 10,
          color: 'var(--figma-color-text-tertiary)',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {LABEL_PLATFORM}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 10,
          color: 'var(--figma-color-text-tertiary)',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {LABEL_CREATIVE}
      </span>
      {extraCell}
      {lastCell !== undefined ? lastCell : <span style={{ width: 18 }} />}
    </div>
  )
}
