import { cn } from '#/lib/cn'

export type BarTone = 'lime' | 'muted' | 'warning'

export type BarSegment = {
  value: number
  tone: BarTone
}

export type BarDatum = {
  label: string
  /** Stacked bottom to top. */
  segments: ReadonlyArray<BarSegment>
}

type BarChartProps = {
  bars: ReadonlyArray<BarDatum>
  /** Text alternative describing the series. */
  label: string
  /** Show every n-th label on the axis, to keep dense series readable. */
  labelEvery?: number
}

const TONE_CLASSES: Record<BarTone, string> = {
  lime: 'bg-lime',
  muted: 'bg-line-strong',
  warning: 'bg-status-partial',
}

/** Vertical (optionally stacked) bars in plain HTML; heights relative to the tallest bar. */
export function BarChart({ bars, label, labelEvery = 1 }: BarChartProps) {
  const totals = bars.map((bar) =>
    bar.segments.reduce((sum, segment) => sum + segment.value, 0),
  )
  const max = Math.max(...totals, 1)
  const columns = bars.map((bar, index) => ({
    ...bar,
    heightPercent: (totals[index] / max) * 100,
    total: totals[index],
    isLabelShown: index % labelEvery === 0 || index === bars.length - 1,
  }))

  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={label}
        className="flex h-36 items-end gap-1 sm:h-40 sm:gap-1.5"
      >
        {columns.map((column) => (
          <div
            key={column.label}
            className="flex h-full min-w-0 flex-1 flex-col-reverse"
          >
            <div
              className="flex flex-col-reverse overflow-hidden rounded-t-[3px]"
              style={{ height: `${column.heightPercent}%` }}
            >
              {column.segments.map((segment) => (
                <span
                  key={segment.tone}
                  className={cn('block w-full', TONE_CLASSES[segment.tone])}
                  style={{
                    height: `${column.total ? (segment.value / column.total) * 100 : 0}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption
        aria-hidden
        className="text-dim flex gap-1 font-mono text-[10px] sm:gap-1.5"
      >
        {columns.map((column) => (
          <span key={column.label} className="min-w-0 flex-1 truncate">
            {column.isLabelShown ? column.label : ''}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
