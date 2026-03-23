import { emit } from '@create-figma-plugin/utilities'
import { BTN_ALIGN_SECTIONS } from '../../../../shared/config/strings'

/** Renders the "Выровнять секции" link that triggers the align-sections operation. */
export function SelectionIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
      <span
        class="link-text"
        onClick={() => emit('align-sections')}
        style={{
          cursor: 'pointer',
          fontSize: 11,
          color: 'var(--figma-color-text-brand)',
          userSelect: 'none',
        }}
      >
        {BTN_ALIGN_SECTIONS}
      </span>
    </div>
  )
}
