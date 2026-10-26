import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { PillGroup } from '#/components/ui/PillGroup'
import { Skeleton } from '#/components/ui/Skeleton'
import { AreaChart } from '#/components/ui/charts/AreaChart'
import { formatBRL, formatSignedPercent } from '#/lib/money'
import { useDashboardOverview } from '../hooks/useDashboardOverview'
import { DASHBOARD_RANGES } from '../schemas'
import type { DashboardRange } from '../types'

type VolumeCardProps = {
  range: DashboardRange
  onRangeChange: (range: DashboardRange) => void
}

const RANGE_OPTIONS = DASHBOARD_RANGES.map((range) => ({
  value: range,
  label: range.toUpperCase(),
}))

export function VolumeCard({ range, onRangeChange }: VolumeCardProps) {
  return (
    <Card
      title="Volume recebido"
      action={
        <PillGroup
          label="Período"
          variant="segmented"
          options={RANGE_OPTIONS}
          value={range}
          onChange={onRangeChange}
        />
      }
    >
      <VolumeBody range={range} />
    </Card>
  )
}

function VolumeBody({ range }: { range: DashboardRange }) {
  const { data, isPending, isError, refetch } = useDashboardOverview(range)

  if (isPending) return <Skeleton lines={6} label="Carregando volume…" />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const { volume } = data
  const chartLabel = `Volume recebido em ${range}: ${formatBRL(volume.totalCents)}, ${formatSignedPercent(volume.delta)}`

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-ink text-[28px] font-bold tracking-tight sm:text-[34px]">
            {formatBRL(volume.totalCents)}
          </span>
          <span className="text-lime font-mono text-[11px]">
            {formatSignedPercent(volume.delta)}
          </span>
        </p>
        <p className="text-dim font-mono text-[10px]">{volume.breakdown}</p>
      </div>
      <AreaChart points={volume.points} label={chartLabel} />
    </>
  )
}
