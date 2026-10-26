import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ErrorState } from '#/components/ui/ErrorState'
import { LiveTag } from '#/components/ui/LiveTag'
import { ProgressBar } from '#/components/ui/ProgressBar'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatCard } from '#/components/ui/StatCard'
import { BarChart } from '#/components/ui/charts/BarChart'
import { NETWORK_META } from '#/features/networks/networks'
import { formatDayTime } from '#/lib/date'
import { formatPercent } from '#/lib/money'
import { useMonitoring } from '../hooks/useAdmin'
import type { Monitoring } from '../types'
import { IncidentsCard } from './IncidentsCard'
import { ServiceHealthList } from './ServiceHealthList'

export function MonitoringView() {
  const { data, isPending, isError, refetch } = useMonitoring()

  if (isPending)
    return (
      <Card>
        <Skeleton lines={10} label="Carregando monitoramento…" />
      </Card>
    )
  if (isError)
    return (
      <Card>
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  return (
    <>
      <MonitoringKpis data={data} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card title="Serviços" action={<LiveTag />} isFlush>
            <ServiceHealthList services={data.services} canRestart />
          </Card>
          <LatencyCard data={data} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <IncidentsCard incidents={data.incidents} />
          <Card title="Confirmações por rede">
            <DescriptionList
              items={data.confirmations.map((row) => ({
                label: NETWORK_META[row.network].fullLabel,
                value: `${row.blocks} blocos · ${row.eta}`,
                tone: row.isDelayed ? 'warning' : 'default',
              }))}
            />
          </Card>
          <Callout tone="warning">
            O atraso do indexador Bitcoin aumenta o tempo de confirmação das
            cobranças em BTC. Cobranças em Sepolia e Amoy não são afetadas.
          </Callout>
          <CapacityCard data={data} />
          <Card title="Última implantação">
            <DescriptionList
              items={[
                { label: 'Versão', value: data.lastDeploy.version },
                {
                  label: 'Publicada',
                  value: formatDayTime(data.lastDeploy.at),
                },
                { label: 'Responsável', value: data.lastDeploy.by },
              ]}
            />
          </Card>
        </div>
      </div>
    </>
  )
}

function MonitoringKpis({ data }: { data: Monitoring }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Disponibilidade"
        value={formatPercent(data.availability, 2)}
        hint="Últimas 24 h"
        tone="accent"
      />
      <StatCard
        label="Maior atraso de bloco"
        value={data.maxBlockLag}
        hint={`blocos · ${data.laggingIndexer}`}
        hintTone="warning"
        tone="warning"
      />
      <StatCard
        label="Fila de webhooks"
        value={data.webhookQueue}
        hint={`jobs · ${data.webhookRetrying} em retentativa`}
      />
      <StatCard
        label="Latência média"
        value={data.averageLatencyMs}
        unit="ms"
        hint={`p95 · ${data.p95LatencyMs} ms`}
      />
    </div>
  )
}

function LatencyCard({ data }: { data: Monitoring }) {
  const peak = Math.max(...data.latencyByHour.map((hour) => hour.seconds))
  const bars = data.latencyByHour.map((hour) => ({
    label: hour.label,
    segments: [
      {
        value: hour.seconds,
        tone: hour.seconds === peak ? ('warning' as const) : ('lime' as const),
      },
    ],
  }))

  return (
    <Card title="Latência de confirmação · 24 h">
      <BarChart
        bars={bars}
        labelEvery={4}
        label={`Latência de confirmação nas últimas 24 horas; pico de ${peak} segundos`}
      />
    </Card>
  )
}

function CapacityCard({ data }: { data: Monitoring }) {
  return (
    <Card title="Capacidade">
      <ul className="flex flex-col gap-3">
        {data.capacity.map((row) => (
          <li key={row.id} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-3 text-xs">
              <span className="text-ink">{row.label}</span>
              <span className="text-muted font-mono">{row.display}</span>
            </div>
            <ProgressBar
              value={row.used / row.limit}
              label={row.label}
              tone={row.used / row.limit > 0.5 ? 'warning' : 'lime'}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}
