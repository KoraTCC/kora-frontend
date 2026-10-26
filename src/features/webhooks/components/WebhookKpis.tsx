import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatCard } from '#/components/ui/StatCard'
import { formatNumber, formatPercent } from '#/lib/money'
import { useWebhookStats } from '../hooks/useWebhooks'

export function WebhookKpis() {
  const { data: stats, isPending, isError, refetch } = useWebhookStats()

  if (isPending) return <Skeleton lines={2} label="Carregando indicadores…" />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Entregues"
        value={formatNumber(stats.delivered)}
        hint="Últimas 24 h"
      />
      <StatCard
        label="Taxa de sucesso"
        value={formatPercent(stats.successRate)}
        hint={`Meta: ${formatPercent(stats.successTarget)}`}
        tone="accent"
      />
      <StatCard
        label="Falhando"
        value={stats.failing}
        hint={`${stats.retryingEndpoints} endpoint em retentativa`}
        hintTone="danger"
        tone="danger"
      />
      <StatCard
        label="Latência média"
        value={stats.averageLatencyMs}
        unit="ms"
        hint={`p95 · ${stats.p95LatencyMs} ms`}
      />
    </div>
  )
}
