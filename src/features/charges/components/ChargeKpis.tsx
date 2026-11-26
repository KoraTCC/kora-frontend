import { ErrorState } from '#/components/ui/ErrorState'
import { SkeletonStats } from '#/components/ui/Skeleton'
import { StatCard } from '#/components/ui/StatCard'
import {
  formatBRL,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from '#/lib/money'
import { useChargeStats } from '../hooks/useCharges'

/** Money-oriented KPIs of the charges page. */
export function ChargeKpis() {
  const { data: stats, isPending, isError, refetch } = useChargeStats()

  if (isPending) return <SkeletonStats />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const confirmed = stats.counts.confirmed
  const hasConfirmed = confirmed > 0
  const lost = `${stats.counts.expired} expiradas · ${stats.counts.failed} falharam`

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total recebido"
        value={formatBRL(stats.receivedCents)}
        hint={`${formatSignedPercent(stats.receivedDelta)} nos últimos 7 dias vs. 7 anteriores`}
        hintTone={stats.receivedDelta < 0 ? 'danger' : 'positive'}
        tone="accent"
      />
      <StatCard
        label="Ticket médio"
        value={formatBRL(stats.averageTicketCents)}
        hint={`${formatNumber(confirmed)} cobranças confirmadas`}
      />
      <StatCard
        label="Taxa de conversão"
        value={formatPercent(stats.conversionRate)}
        hint={lost}
      />
      <StatCard
        label="Tempo até confirmar"
        value={hasConfirmed ? stats.medianConfirmMinutes : '—'}
        unit={hasConfirmed ? 'min' : undefined}
        hint="mediana das cobranças confirmadas"
      />
    </div>
  )
}
