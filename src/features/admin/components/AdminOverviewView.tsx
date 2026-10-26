import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { LiveTag } from '#/components/ui/LiveTag'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatCard } from '#/components/ui/StatCard'
import { formatBRLCompact, formatNumber, formatPercent } from '#/lib/money'
import { useOverview } from '../hooks/useAdmin'
import type { AdminRange, Overview } from '../types'
import { ChargesPerDayCard } from './ChargesPerDayCard'
import { IncidentsCard } from './IncidentsCard'
import { RecentAuditCard } from './RecentAuditCard'
import { ServiceHealthList } from './ServiceHealthList'
import { TopMerchantsCard } from './TopMerchantsCard'

type AdminOverviewViewProps = {
  range: AdminRange
}

export function AdminOverviewView({ range }: AdminOverviewViewProps) {
  const { data, isPending, isError, refetch } = useOverview(range)

  if (isPending)
    return (
      <Card>
        <Skeleton lines={10} label="Carregando visão geral…" />
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
      <OverviewKpis overview={data} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="flex min-w-0 flex-col gap-4">
          <ChargesPerDayCard overview={data} />
          <TopMerchantsCard merchants={data.topMerchants} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Card title="Saúde dos serviços" action={<LiveTag />} isFlush>
            <ServiceHealthList services={data.services} />
          </Card>
          <IncidentsCard incidents={data.incidents} title="Incidentes" />
          <RecentAuditCard entries={data.recentAudit} />
        </div>
      </div>
    </>
  )
}

function OverviewKpis({ overview }: { overview: Overview }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Lojistas ativos"
        value={overview.activeMerchants}
        hint={`+${overview.newMerchants} esta semana`}
        hintTone="positive"
      />
      <StatCard
        label="Volume transacionado"
        value={formatBRLCompact(overview.volumeCents)}
        hint={overview.volumeBreakdown}
        tone="accent"
      />
      <StatCard
        label="Cobranças"
        value={formatNumber(overview.charges)}
        hint={`${formatPercent(overview.confirmedRate)} confirmadas`}
      />
      <StatCard
        label="Incidentes abertos"
        value={overview.openIncidents}
        hint={`${overview.unassignedIncidents} sem responsável`}
        hintTone="danger"
        tone="danger"
      />
    </div>
  )
}
