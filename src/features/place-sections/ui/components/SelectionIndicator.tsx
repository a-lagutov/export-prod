import { emit } from '@create-figma-plugin/utilities'
import {
  MSG_SELECT_FRAMES,
  BTN_ALIGN_SECTIONS,
  selectedFramesLabel,
} from '../../../../shared/config/strings'

/**
 * Displays how many frames are currently selected on the Figma page.
 * Shows a branded highlight when frames are selected; a muted state otherwise.
 * Also renders an "Выровнять секции" link that triggers the align-sections operation.
 * @param root0
 * @param root0.selectedCount
 */
export function SelectionIndicator({ selectedCount }: { selectedCount: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div
        style={{
          flex: 1,
          padding: '7px 10px',
          background:
            selectedCount > 0 ? 'var(--figma-color-bg-brand)' : 'var(--figma-color-bg-secondary)',
          borderRadius: 6,
          fontSize: 11,
          color:
            selectedCount > 0
              ? 'var(--figma-color-text-onbrand)'
              : 'var(--figma-color-text-secondary)',
        }}
      >
        {selectedCount > 0 ? selectedFramesLabel(selectedCount) : MSG_SELECT_FRAMES}
      </div>
      <span
        class="link-text"
        onClick={() => emit('align-sections')}
        style={{
          cursor: 'pointer',
          fontSize: 11,
          color: 'var(--figma-color-text-brand)',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {BTN_ALIGN_SECTIONS}
      </span>
    </div>
  )
}
