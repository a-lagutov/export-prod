import { useRef } from 'react'
import { Text } from '@create-figma-plugin/ui'
import { NumInput } from '../../../../shared/ui/NumInput'
import { LABEL_GIF_DELAY, SUFFIX_SEC } from '../../../../shared/config/strings'

/**
 * Full-width row for configuring the GIF frame delay in seconds.
 * Clicking anywhere on the row focuses the numeric input.
 * @param root0
 * @param root0.value
 * @param root0.onChange
 */
export function GifDelayRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div
      class="limit-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 12px',
        margin: '0 -12px',
        cursor: 'default',
      }}
      onClick={() => containerRef.current?.querySelector('input')?.focus()}
    >
      <Text>{LABEL_GIF_DELAY}</Text>
      <div style={{ width: 54 }}>
        <NumInput
          value={value}
          onChange={onChange}
          suffix={SUFFIX_SEC}
          containerRef={containerRef}
        />
      </div>
    </div>
  )
}
