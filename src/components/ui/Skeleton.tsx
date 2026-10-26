type SkeletonProps = {
  /** How many placeholder lines. */
  lines?: number
  /** Accessible text announced while loading. */
  label?: string
}

export function Skeleton({ lines = 3, label = 'Carregando…' }: SkeletonProps) {
  const rows = Array.from({ length: lines }, (_, index) => `row-${index}`)

  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2.5">
      <span className="sr-only">{label}</span>
      {rows.map((row) => (
        <span
          key={row}
          aria-hidden
          className="bg-surface-2 h-3.5 w-full animate-pulse rounded-[6px] last:w-2/3"
        />
      ))}
    </div>
  )
}
