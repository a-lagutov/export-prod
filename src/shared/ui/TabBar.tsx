import { TAB_EXPORT, TAB_ORGANIZE } from '../config/strings'

/**
 * Top navigation bar with two tabs: "Экспорт" and "Разместить".
 * @param root0
 * @param root0.active
 * @param root0.onChange
 */
export function TabBar({
  active,
  onChange,
}: {
  active: 'export' | 'organize'
  onChange: (t: 'export' | 'organize') => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--figma-color-border)',
        background: 'var(--figma-color-bg)',
        flexShrink: 0,
      }}
    >
      {(
        [
          { key: 'export', label: TAB_EXPORT },
          { key: 'organize', label: TAB_ORGANIZE },
        ] as const
      ).map(({ key, label }) => (
        <button
          key={key}
          class={active === key ? 'tab-btn tab-active' : 'tab-btn'}
          onClick={() => onChange(key)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderBottom:
              active === key ? '2px solid var(--figma-color-bg-brand)' : '2px solid transparent',
            background: 'transparent',
            color: active === key ? 'var(--figma-color-text)' : 'var(--figma-color-text-secondary)',
            fontSize: 12,
            fontWeight: active === key ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
