import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatCard } from '#/components/ui/StatCard'
import { formatNumber, formatPercent, formatSignedPercent } from '#/lib/money'
import { useRequestStats } from '../hooks/useRequestLogs'

export function RequestKpis() {
  const { data: stats, isPending, isError, refetch } = useRequestStats()

  if (isPending) return <Skeleton lines={2} label="Carregando indicadores…" />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Requisições"
        value={formatNumber(stats.requests)}
        hint="Últimas 24 h"
      />
      <StatCard
        label="Sucesso (2xx)"
        value={formatPercent(stats.successRate)}
        hint={`${formatSignedPercent(stats.successDelta)} vs. ontem`}
        hintTone="positive"
        tone="accent"
      />
      <StatCard
        label="Erros do cliente (4xx)"
        value={formatNumber(stats.clientErrors)}
        hint={`Maioria: ${stats.topClientError}`}
        hintTone="warning"
        tone="warning"
      />
      <StatCard
        label="Latência p95"
        value={stats.p95LatencyMs}
        unit="ms"
        hint={`Média · ${stats.averageLatencyMs} ms`}
      />
    </div>
  )
}
