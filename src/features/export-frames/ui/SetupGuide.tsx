import {
  GUIDE_TITLE,
  GUIDE_DESCRIPTION,
  LABEL_FORMAT,
  LABEL_CHANNEL,
  LABEL_PLATFORM,
  LABEL_CREATIVE,
  PLACEHOLDER_FORMAT,
  PLACEHOLDER_CHANNEL,
  PLACEHOLDER_PLATFORM,
  PLACEHOLDER_CREATIVE,
  GUIDE_NAMING_TITLE,
  GUIDE_NAMING_JIRA,
  GUIDE_NAMING_CREATIVE_HINT,
  GUIDE_NAMING_WORDS_SEPARATOR,
  GUIDE_FRAME_RENAME_NOTE,
  GUIDE_GIF_NOTE,
  GUIDE_NAMING_LINK,
  GUIDE_FRAME_SIZE_EXAMPLE,
} from '../../../shared/config/strings'

/**
 * Empty-state guide shown on the Export tab when no valid section hierarchy is found on the page.
 * Explains the required 4-level structure, creative naming conventions, and links to the wiki.
 */
export function SetupGuide() {
  return (
    <div
      style={{
        padding: 16,
        background: 'var(--figma-color-bg-secondary)',
        borderRadius: 8,
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--figma-color-text)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{GUIDE_TITLE}</div>
      <div style={{ color: 'var(--figma-color-text-secondary)', marginBottom: 12 }}>
        {GUIDE_DESCRIPTION}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {[
          { level: '1', label: LABEL_FORMAT, desc: PLACEHOLDER_FORMAT, color: '#7B61FF' },
          { level: '2', label: LABEL_CHANNEL, desc: PLACEHOLDER_CHANNEL, color: '#0D99FF' },
          { level: '3', label: LABEL_PLATFORM, desc: PLACEHOLDER_PLATFORM, color: '#14AE5C' },
          { level: '4', label: LABEL_CREATIVE, desc: PLACEHOLDER_CREATIVE, color: '#F24822' },
        ].map(({ level, label, desc, color }) => (
          <div
            key={level}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              background: 'var(--figma-color-bg)',
              borderRadius: 6,
              borderLeft: `3px solid ${color}`,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: color,
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {level}
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--figma-color-text-secondary)' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Example tree */}
      <div
        style={{
          padding: '8px 10px',
          background: 'var(--figma-color-bg)',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'monospace',
          lineHeight: '17px',
          color: 'var(--figma-color-text-secondary)',
        }}
      >
        <div>JPG</div>
        <div style={{ paddingLeft: 12 }}>5_Context_Media</div>
        <div style={{ paddingLeft: 24 }}>VK</div>
        <div style={{ paddingLeft: 36 }}>1234-card</div>
      </div>

      {/* Naming rules */}
      <div
        style={{
          marginTop: 12,
          padding: '8px 10px',
          background: 'var(--figma-color-bg)',
          borderRadius: 6,
          fontSize: 11,
          lineHeight: '17px',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{GUIDE_NAMING_TITLE}</div>
        <div style={{ color: 'var(--figma-color-text-secondary)' }}>
          <span style={{ fontWeight: 600 }}>xxxx</span> {GUIDE_NAMING_JIRA}
          <br />
          <span style={{ fontWeight: 600 }}>yyy</span> {GUIDE_NAMING_CREATIVE_HINT}
        </div>
        <div style={{ marginTop: 6, color: 'var(--figma-color-text-secondary)' }}>
          <div>
            <span style={{ fontFamily: 'monospace', color: 'var(--figma-color-text)' }}>
              1234-card
            </span>
          </div>
          <div>
            <span style={{ fontFamily: 'monospace', color: 'var(--figma-color-text)' }}>
              1234-skidka
            </span>
          </div>
        </div>
        <div style={{ marginTop: 4, color: 'var(--figma-color-text-secondary)' }}>
          {GUIDE_NAMING_WORDS_SEPARATOR}
        </div>
        <div style={{ color: 'var(--figma-color-text-secondary)' }}>
          <div>
            <span style={{ fontFamily: 'monospace', color: 'var(--figma-color-text)' }}>
              1234-yellow.card
            </span>
          </div>
          <div>
            <span style={{ fontFamily: 'monospace', color: 'var(--figma-color-text)' }}>
              1234-black.card
            </span>
          </div>
        </div>
      </div>

      {/* Wiki link */}
      <a
        href="https://wiki.tcsbank.ru/pages/viewpage.action?pageId=6135577587"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          marginTop: 8,
          padding: '7px 0',
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--figma-color-text-brand)',
          background: 'var(--figma-color-bg)',
          border: '1px solid var(--figma-color-border)',
          borderRadius: 6,
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {GUIDE_NAMING_LINK}
      </a>

      {/* Frame auto-rename note */}
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: 'var(--figma-color-text-secondary)',
        }}
      >
        {GUIDE_FRAME_RENAME_NOTE}{' '}
        <span style={{ fontFamily: 'monospace' }}>{GUIDE_FRAME_SIZE_EXAMPLE}</span>).
        <br />
        {GUIDE_GIF_NOTE}
      </div>
    </div>
  )
}
