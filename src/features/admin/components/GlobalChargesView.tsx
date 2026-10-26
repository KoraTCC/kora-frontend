import { Card } from '#/components/ui/Card'
import { DistributionBar } from '#/components/ui/DistributionBar'
import { ErrorState } from '#/components/ui/ErrorState'
import { LiveTag } from '#/components/ui/LiveTag'
import { Select } from '#/components/ui/Select'
import { Skeleton } from '#/components/ui/Skeleton'
import { CHARGE_STATUS_META } from '#/features/charges/chargeStatus'
import { CHARGE_STATUSES, chargeStatusSchema } from '#/features/charges/schemas'
import {
  NETWORKS,
  NETWORK_META,
  networkSchema,
} from '#/features/networks/networks'
import { formatPercent } from '#/lib/money'
import { useGlobalCharges } from '../hooks/useAdmin'
import type { GlobalChargesSearch } from '../types'
import { AnomaliesCard, GlobalChargesKpis } from './GlobalChargesCards'
import { GlobalChargesBody } from './GlobalChargesBody'

const PAGE_SIZE = 8

const STATUS_OPTIONS = [
  { value: '', label: 'Status' },
  ...CHARGE_STATUSES.map((status) => ({
    value: status,
    label: CHARGE_STATUS_META[status].plural,
  })),
]
const NETWORK_OPTIONS = [
  { value: '', label: 'Rede' },
  ...NETWORKS.map((network) => ({
    value: network,
    label: NETWORK_META[network].fullLabel,
  })),
]

type GlobalChargesViewProps = {
  search: GlobalChargesSearch
  onSearchChange: (next: GlobalChargesSearch) => void
}

export function GlobalChargesView({
  search,
  onSearchChange,
}: GlobalChargesViewProps) {
  const query = useGlobalCharges(search, PAGE_SIZE)

  function handleStatusChange(value: string) {
    const parsed = chargeStatusSchema.safeParse(value)
    onSearchChange({
      ...search,
      status: parsed.success ? parsed.data : undefined,
      page: undefined,
    })
  }

  function handleNetworkChange(value: string) {
    const parsed = networkSchema.safeParse(value)
    onSearchChange({
      ...search,
      network: parsed.success ? parsed.data : undefined,
      page: undefined,
    })
  }

  if (query.isPending)
    return (
      <Card>
        <Skeleton lines={10} label="Carregando cobranças…" />
      </Card>
    )
  if (query.isError)
    return (
      <Card>
        <ErrorState onRetry={() => void query.refetch()} />
      </Card>
    )

  return (
    <>
      <GlobalChargesKpis data={query.data} />
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Select
                label="Status"
                isLabelHidden
                size="sm"
                options={STATUS_OPTIONS}
                value={search.status ?? ''}
                onChange={(event) => handleStatusChange(event.target.value)}
                className="w-40"
              />
              <Select
                label="Rede"
                isLabelHidden
                size="sm"
                options={NETWORK_OPTIONS}
                value={search.network ?? ''}
                onChange={(event) => handleNetworkChange(event.target.value)}
                className="w-48"
              />
            </div>
            <LiveTag />
          </div>
          <Card isFlush>
            <GlobalChargesBody
              data={query.data}
              onPageChange={(page) => onSearchChange({ ...search, page })}
            />
          </Card>
        </div>
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2 2xl:flex 2xl:flex-col">
          <Card title="Distribuição por estado">
            <DistributionBar
              items={query.data.distribution.map((row) => ({
                id: row.status,
                label: CHARGE_STATUS_META[row.status].plural,
                share: row.share,
                tone: CHARGE_STATUS_META[row.status].tone,
              }))}
              formatShare={(share) => formatPercent(share, 0)}
            />
          </Card>
          <AnomaliesCard
            anomalies={query.data.anomalies}
            total={query.data.stats.anomalies}
          />
        </div>
      </div>
    </>
  )
}
