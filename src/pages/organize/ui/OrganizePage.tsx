import { useState, useEffect } from 'react'
import { emit, on } from '@create-figma-plugin/utilities'
import { Button, IconWarning16, VerticalSpace, SegmentedControl } from '@create-figma-plugin/ui'
import { track } from '../../../shared/analytics/index'
import {
  MODE_BY_FIELDS,
  MODE_BY_PATH,
  MODE_SECTIONS,
  LABEL_FORMAT,
  LABEL_CHANNEL,
  LABEL_PLATFORM,
  LABEL_CREATIVE,
  PLACEHOLDER_FORMAT,
  PLACEHOLDER_CHANNEL,
  PLACEHOLDER_PLATFORM,
  PLACEHOLDER_CREATIVE,
  MSG_SELECT_FRAMES,
  MSG_FILL_FIELDS,
  placeBtnLabel,
} from '../../../shared/config/strings'
import { SelectionIndicator } from '../../../features/place-sections/ui/components/SelectionIndicator'
import { PlaceResultMessage } from '../../../features/place-sections/ui/components/PlaceResultMessage'
import { PathField } from '../../../features/place-sections/ui/components/PathField'
import { PathInput } from '../../../features/place-sections/ui/components/PathInput'
import { SectionTreePanel } from '../../../widgets/section-tree/ui/SectionTreePanel'
import type { SectionFormat } from '../../../entities/frame/model/types'

/**
 * Place tab root component. Lets the user assign selected Figma frames to a section hierarchy.
 * Supports two input modes: "fields" (separate dropdowns) and "path" (slash-separated input).
 * Emits `get-sections` on mount and listens for `sections-data`, `selection-change`, and `place-result`.
 */
export function OrganizePage() {
  const [sections, setSections] = useState<SectionFormat[]>([])
  const [selectedCount, setSelectedCount] = useState(0)
  const [inputMode, setInputMode] = useState<'fields' | 'path' | 'sections'>('fields')

  // Fields mode state
  const [format, setFormat] = useState('')
  const [channel, setChannel] = useState('')
  const [platform, setPlatform] = useState('')
  const [creative, setCreative] = useState('')

  // Path mode state
  const [pathInput, setPathInput] = useState('')

  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    const offs = [
      on('sections-data', ({ sections }: { sections: SectionFormat[] }) => setSections(sections)),
      on('selection-change', ({ count }: { count: number }) => setSelectedCount(count)),
      on('place-result', ({ success, message }: { success: boolean; message: string }) =>
        setResult({ success, message }),
      ),
    ]
    emit('get-sections')
    return () => offs.forEach((off) => off())
  }, [])

  // Derived autocomplete options — each field shows all unique values across all sections
  const channelOptions = [...new Set(sections.flatMap((s) => s.channels.map((c) => c.name)))]
  const platformOptions = [
    ...new Set(sections.flatMap((s) => s.channels.flatMap((c) => c.platforms.map((p) => p.name)))),
  ]
  const creativeOptions = [
    ...new Set(
      sections.flatMap((s) => s.channels.flatMap((c) => c.platforms.flatMap((p) => p.creatives))),
    ),
  ]

  // Effective values based on mode
  /** Returns the active format/channel/platform/creative values from whichever input mode is selected. */
  function getEffectiveValues() {
    if (inputMode === 'fields') {
      return { fmt: format.trim(), ch: channel.trim(), pl: platform.trim(), cr: creative.trim() }
    }
    const parts = pathInput.split('/').map((s) => s.trim())
    return { fmt: parts[0] || '', ch: parts[1] || '', pl: parts[2] || '', cr: parts[3] || '' }
  }

  const { fmt: eFmt, ch: eCh, pl: ePl, cr: eCr } = getEffectiveValues()
  // In "sections" mode placement is done via the + buttons in the panel, not the bottom button
  const canPlace = inputMode !== 'sections' && !!(eFmt && eCh && ePl && eCr && selectedCount > 0)
  const showBottomBar = inputMode !== 'sections'

  /**
   * Clears the previous result, tracks the analytics event, and emits `place-frames` to the code thread.
   * @param fmt
   * @param ch
   * @param pl
   * @param cr
   */
  function doPlace(fmt: string, ch: string, pl: string, cr: string) {
    setResult(null)
    track('frames_placed', {
      format: fmt,
      channel: ch,
      platform: pl,
      creative: cr,
      frame_count: selectedCount,
      input_mode: inputMode,
    })
    emit('place-frames', { formatName: fmt, channelName: ch, platformName: pl, creativeName: cr })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 12,
      }}
    >
      {/* Fixed top: indicator + mode toggle */}
      <div style={{ padding: '12px 12px 0' }}>
        <SelectionIndicator />
        <div class="seg-full">
          <SegmentedControl
            value={inputMode}
            options={[
              { value: 'fields', children: MODE_BY_FIELDS },
              { value: 'path', children: MODE_BY_PATH },
              { value: 'sections', children: MODE_SECTIONS },
            ]}
            onValueChange={setInputMode}
          />
        </div>
        <VerticalSpace space="small" />
      </div>

      {/* Sections mode: full-width panel fills remaining space */}
      {inputMode === 'sections' && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <SectionTreePanel
            sections={sections}
            onPlace={doPlace}
            selectedCount={selectedCount}
            inline
          />
        </div>
      )}

      {/* Fields / path mode: scrollable content */}
      {inputMode !== 'sections' && (
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '0 12px 12px' }}>
          {inputMode === 'fields' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <PathField
                label={LABEL_FORMAT}
                value={format}
                onChange={setFormat}
                options={['JPG', 'PNG', 'WEBP', 'GIF']}
                placeholder={PLACEHOLDER_FORMAT}
              />
              <PathField
                label={LABEL_CHANNEL}
                value={channel}
                onChange={setChannel}
                options={channelOptions}
                placeholder={PLACEHOLDER_CHANNEL}
              />
              <PathField
                label={LABEL_PLATFORM}
                value={platform}
                onChange={setPlatform}
                options={platformOptions}
                placeholder={PLACEHOLDER_PLATFORM}
              />
              <PathField
                label={LABEL_CREATIVE}
                value={creative}
                onChange={setCreative}
                options={creativeOptions}
                placeholder={PLACEHOLDER_CREATIVE}
              />
            </div>
          )}

          {inputMode === 'path' && (
            <PathInput value={pathInput} onChange={setPathInput} sections={sections} />
          )}

          {result && <PlaceResultMessage result={result} />}
        </div>
      )}

      {/* Place button or warning — pinned to bottom; hidden in sections mode */}
      {showBottomBar && (
        <div
          style={{
            padding: '12px 16px 16px',
            background: 'var(--figma-color-bg)',
            borderTop: '1px solid var(--figma-color-border)',
          }}
        >
          <div class="export-btn-wrap">
            <style>{`.export-btn-wrap button { padding: 12px 16px !important; font-size: 13px !important; height: auto !important; }`}</style>
            {canPlace ? (
              <Button fullWidth onClick={() => doPlace(eFmt, eCh, ePl, eCr)}>
                {placeBtnLabel(selectedCount)}
              </Button>
            ) : (
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
                <span style={{ color: 'var(--figma-color-text-onwarning)' }}>
                  {selectedCount === 0 ? MSG_SELECT_FRAMES : MSG_FILL_FIELDS}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
