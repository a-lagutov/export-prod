import { FlatTableRow } from '../../../../shared/ui/FlatTableRow'
import { BTN_ADD_FRAMES_TITLE, MSG_SELECT_FRAMES } from '../../../../shared/config/strings'

/**
 * A flat table row for the section-add table view.
 * Uses the shared `FlatTableRow` layout; last cell is a "+" add button.
 * @param root0
 * @param root0.format
 * @param root0.channel
 * @param root0.platform
 * @param root0.creative
 * @param root0.onAdd
 * @param root0.enabled
 */
export function SectionTableRow({
  format,
  channel,
  platform,
  creative,
  onAdd,
  enabled,
}: {
  format: string
  channel: string
  platform: string
  creative: string
  onAdd: () => void
  enabled: boolean
}) {
  return (
    <FlatTableRow
      format={format}
      channel={channel}
      platform={platform}
      creative={creative}
      onClick={enabled ? onAdd : undefined}
      lastCell={
        <button
          class={enabled ? 'btn-icon' : undefined}
          onClick={(e) => {
            e.stopPropagation()
            if (enabled) onAdd()
          }}
          title={enabled ? BTN_ADD_FRAMES_TITLE : MSG_SELECT_FRAMES}
          style={{
            width: 18,
            height: 18,
            border: 'none',
            borderRadius: 3,
            background: 'transparent',
            color: enabled ? 'var(--figma-color-text-brand)' : 'var(--figma-color-text-disabled)',
            fontSize: 14,
            lineHeight: '16px',
            cursor: enabled ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 0,
          }}
        >
          +
        </button>
      }
    />
  )
}
