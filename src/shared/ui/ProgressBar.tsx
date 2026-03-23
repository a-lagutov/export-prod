export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        flex: 1,
        height: 6,
        background: 'var(--figma-color-bg-secondary)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'var(--figma-color-bg-brand)',
          width: `${pct}%`,
          transition: 'width 0.2s',
        }}
      />
    </div>
  )
}
