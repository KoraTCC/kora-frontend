import { Card } from '#/components/ui/Card'
import { BarChart } from '#/components/ui/charts/BarChart'
import { formatNumber, formatSignedPercent } from '#/lib/money'
import type { Overview } from '../types'

type ChargesPerDayCardProps = {
  overview: Overview
}

export function ChargesPerDayCard({ overview }: ChargesPerDayCardProps) {
  const bars = overview.chargesPerDay.map((day) => ({
    label: day.label,
    segments: [
      { value: day.expired, tone: 'muted' as const },
      { value: day.confirmed, tone: 'lime' as const },
    ],
  }))
  const chartLabel = `Cobranças por dia: ${formatNumber(overview.charges)} no período, ${formatSignedPercent(overview.chargesDelta)}`

  return (
    <Card
      title="Cobranças por dia"
      action={
        <span className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-muted flex items-center gap-1.5">
            <span aria-hidden className="bg-lime size-1.5 rounded-full" />{' '}
            Confirmadas
          </span>
          <span className="text-muted flex items-center gap-1.5">
            <span
              aria-hidden
              className="bg-line-strong size-1.5 rounded-full"
            />{' '}
            Expiradas
          </span>
        </span>
      }
    >
      <p className="flex items-baseline gap-2">
        <span className="font-display text-ink text-[28px] font-bold tracking-tight">
          {formatNumber(overview.charges)}
        </span>
        <span className="text-muted text-xs">cobranças</span>
        <span className="text-lime font-mono text-[11px]">
          {formatSignedPercent(overview.chargesDelta)}
        </span>
      </p>
      <BarChart bars={bars} label={chartLabel} />
    </Card>
  )
}
