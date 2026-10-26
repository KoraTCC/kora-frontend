import { useId } from 'react'

export type ChartPoint = {
  label: string
  value: number
}

type AreaChartProps = {
  points: ReadonlyArray<ChartPoint>
  /** Text alternative describing the trend. */
  label: string
}

const WIDTH = 600
const HEIGHT = 180
const PADDING_Y = 12

/** Single-series area chart, drawn in plain SVG; stretches to its parent's width. */
export function AreaChart({ points, label }: AreaChartProps) {
  const gradientId = useId()
  const { linePath, areaPath } = buildPaths(points)

  return (
    <figure className="flex flex-col gap-2">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="text-lime h-40 w-full sm:h-44"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <figcaption
        aria-hidden
        className="text-dim flex justify-between font-mono text-[10px]"
      >
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </figcaption>
    </figure>
  )
}

export function buildPaths(points: ReadonlyArray<ChartPoint>) {
  if (points.length < 2) return { linePath: '', areaPath: '' }

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const stepX = WIDTH / (points.length - 1)
  const coordinates = values.map((value, index) => {
    const x = index * stepX
    const y =
      HEIGHT - PADDING_Y - ((value - min) / range) * (HEIGHT - PADDING_Y * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = `M${coordinates.join(' L')}`
  const areaPath = `${linePath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`
  return { linePath, areaPath }
}
