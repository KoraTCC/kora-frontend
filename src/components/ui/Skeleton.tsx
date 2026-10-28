import { cn } from '#/lib/cn'

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
        <SkeletonBox key={row} className="h-3.5 w-full last:w-2/3" />
      ))}
    </div>
  )
}

type SkeletonBoxProps = {
  /** Size and shape — `h-8 w-24`, `h-[220px] w-full`, `rounded-full`… */
  className?: string
}

/** One placeholder shape. Compose them to mirror the real layout. */
export function SkeletonBox({ className }: SkeletonBoxProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-surface-2 block animate-pulse rounded-[6px] motion-reduce:animate-none',
        className,
      )}
    />
  )
}

type SkeletonStatsProps = {
  count?: number
  label?: string
}

/** Placeholder for a row of `StatCard`s, with the same grid. */
export function SkeletonStats({
  count = 4,
  label = 'Carregando indicadores…',
}: SkeletonStatsProps) {
  const cards = Array.from({ length: count }, (_, index) => `stat-${index}`)

  return (
    <div
      role="status"
      aria-live="polite"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <span className="sr-only">{label}</span>
      {cards.map((card) => (
        <div
          key={card}
          className="border-line bg-surface flex flex-col gap-3 rounded-[14px] border p-4"
        >
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-7 w-16" />
          <SkeletonBox className="h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

type SkeletonChartProps = {
  label?: string
}

/** Placeholder for a chart: a few bars of different heights. */
export function SkeletonChart({
  label = 'Carregando gráfico…',
}: SkeletonChartProps) {
  const heights = [
    'h-1/3',
    'h-1/2',
    'h-2/5',
    'h-3/4',
    'h-3/5',
    'h-full',
    'h-2/3',
  ]

  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">{label}</span>
      <SkeletonBox className="h-7 w-40" />
      <div className="flex h-[180px] items-end gap-2">
        {heights.map((height) => (
          <SkeletonBox key={height} className={cn('flex-1', height)} />
        ))}
      </div>
    </div>
  )
}

type SkeletonRowsProps = {
  rows?: number
  label?: string
}

/** Placeholder for a table: one line per row with a few columns. */
export function SkeletonRows({
  rows = 5,
  label = 'Carregando…',
}: SkeletonRowsProps) {
  const items = Array.from({ length: rows }, (_, index) => `line-${index}`)

  return (
    <div role="status" aria-live="polite" className="flex flex-col">
      <span className="sr-only">{label}</span>
      {items.map((item) => (
        <div
          key={item}
          className="border-line-soft flex items-center gap-4 border-b py-3 last:border-b-0"
        >
          <SkeletonBox className="h-3.5 w-24" />
          <SkeletonBox className="h-3.5 flex-1" />
          <SkeletonBox className="h-5 w-20 rounded-full" />
          <SkeletonBox className="h-3.5 w-16" />
        </div>
      ))}
    </div>
  )
}
