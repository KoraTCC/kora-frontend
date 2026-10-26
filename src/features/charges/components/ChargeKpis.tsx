import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
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

  if (isPending) return <Skeleton lines={2} label="Carregando indicadores…" />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const confirmed = stats.counts.confirmed
  const lost = `${stats.counts.expired} expiradas · ${stats.counts.failed} falharam`

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Recebido no período"
        value={formatBRL(stats.receivedCents)}
        hint={`${formatSignedPercent(stats.receivedDelta)} vs. semana passada`}
        hintTone="positive"
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
        value={stats.medianConfirmMinutes}
        unit="min"
        hint="mediana · Sepolia e Amoy"
      />
    </div>
  )
}
