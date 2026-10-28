import { ErrorState } from '#/components/ui/ErrorState'
import { SkeletonStats } from '#/components/ui/Skeleton'
import { StatCard } from '#/components/ui/StatCard'
import { useChargeStats } from '#/features/charges/hooks/useCharges'
import { formatBRL, formatPercent, formatSignedPercent } from '#/lib/money'

/** Charge counts by status — what needs attention today. */
export function DashboardKpis() {
  const { data: stats, isPending, isError, refetch } = useChargeStats()

  if (isPending) return <SkeletonStats />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  // Conta nova ainda não tem cobranças: evita 0/0 = NaN.
  const expiredShare =
    stats.total === 0 ? 0 : stats.counts.expired / stats.total

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        dot="pending"
        label="Pendentes"
        value={stats.counts.pending}
        hint={`${formatBRL(stats.pendingAmountCents)} na janela`}
      />
      <StatCard
        dot="confirmed"
        label="Confirmadas"
        value={stats.counts.confirmed}
        hint={`${formatSignedPercent(stats.confirmedDelta)} vs. semana passada`}
        hintTone="positive"
        tone="accent"
      />
      <StatCard
        dot="expired"
        label="Expiradas"
        value={stats.counts.expired}
        hint={`${formatPercent(expiredShare)} do total`}
      />
      <StatCard
        dot="partial"
        label="Parciais"
        value={stats.counts.partial}
        hint="Precisam de revisão"
        hintTone="warning"
        tone="warning"
      />
    </div>
  )
}
