import { Card } from '#/components/ui/Card'
import { StatCard } from '#/components/ui/StatCard'
import { formatBRL, formatNumber, formatPercent } from '#/lib/money'
import type { GlobalCharges } from '../types'

export function GlobalChargesKpis({ data }: { data: GlobalCharges }) {
  const { stats } = data
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total"
        value={formatNumber(stats.total)}
        hint="Últimas 24 h"
      />
      <StatCard
        label="Confirmadas"
        value={formatNumber(stats.confirmed)}
        hint={`${formatPercent(stats.confirmed / stats.total)} do total`}
        tone="accent"
      />
      <StatCard
        label="Pendentes"
        value={formatNumber(stats.pending)}
        hint={`${formatBRL(stats.pendingAmountCents)} na janela`}
      />
      <StatCard
        label="Anomalias"
        value={stats.anomalies}
        hint="Precisam de revisão"
        hintTone="warning"
        tone="warning"
      />
    </div>
  )
}

export function AnomaliesCard({
  anomalies,
  total,
}: {
  anomalies: GlobalCharges['anomalies']
  total: number
}) {
  return (
    <Card
      title="Anomalias"
      action={
        <span className="text-status-partial font-mono text-[10px]">
          {total}
        </span>
      }
    >
      <ul className="flex flex-col gap-3">
        {anomalies.map((anomaly) => (
          <li key={anomaly.id} className="flex flex-col gap-0.5">
            <p className="text-ink text-[13px]">{anomaly.title}</p>
            <p className="text-dim font-mono text-[10px]">
              {anomaly.chargeId} · {anomaly.merchantId}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
