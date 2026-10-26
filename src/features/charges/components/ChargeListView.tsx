import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Pagination } from '#/components/ui/Pagination'
import { Skeleton } from '#/components/ui/Skeleton'
import { networkSchema } from '#/features/networks/networks'
import { formatNumber } from '#/lib/money'
import { useChargeList } from '../hooks/useCharges'
import { useExportCharges } from '../hooks/useExportCharges'
import type { ChargeListSearch, ChargePage } from '../types'
import { ChargeKpis } from './ChargeKpis'
import { ChargeListToolbar } from './ChargeListToolbar'
import { ChargeStatusFilter } from './ChargeStatusFilter'
import type { ChargeStatusFilterValue } from './ChargeStatusFilter'
import { ChargesTable } from './ChargesTable'

export const CHARGES_PAGE_SIZE = 20

type ChargeListViewProps = {
  search: ChargeListSearch
  onSearchChange: (next: ChargeListSearch) => void
}

export function ChargeListView({
  search,
  onSearchChange,
}: ChargeListViewProps) {
  const page = search.page ?? 1
  const query = useChargeList({
    status: search.status,
    network: search.network,
    q: search.q,
    page,
    pageSize: CHARGES_PAGE_SIZE,
  })
  const exportCharges = useExportCharges()

  function handleStatusChange(status: ChargeStatusFilterValue) {
    onSearchChange({
      ...search,
      status: status === 'all' ? undefined : status,
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

  function handleQueryChange(q: string) {
    onSearchChange({ ...search, q: q || undefined, page: undefined })
  }

  return (
    <>
      <ChargeKpis />

      {query.data ? (
        <ChargeStatusFilter
          value={search.status ?? 'all'}
          onChange={handleStatusChange}
          counts={query.data.counts}
          total={query.data.totalAll}
        />
      ) : null}

      <ChargeListToolbar
        search={search}
        onQueryChange={handleQueryChange}
        onNetworkChange={handleNetworkChange}
        onExport={() => exportCharges(query.data?.items ?? [])}
        canExport={Boolean(query.data?.items.length)}
      />

      <Card isFlush>
        <ChargeListBody
          query={query}
          onPageChange={(nextPage) =>
            onSearchChange({ ...search, page: nextPage })
          }
        />
      </Card>
    </>
  )
}

type ChargeListBodyProps = {
  query: ReturnType<typeof useChargeList>
  onPageChange: (page: number) => void
}

function ChargeListBody({ query, onPageChange }: ChargeListBodyProps) {
  if (query.isPending) {
    return (
      <div className="p-4">
        <Skeleton lines={8} label="Carregando cobranças…" />
      </div>
    )
  }
  if (query.isError) {
    return (
      <div className="p-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    )
  }
  if (!query.data.items.length) {
    return (
      <EmptyState
        title="Nenhuma cobrança encontrada"
        description="Ajuste os filtros ou a busca para ver outras cobranças."
      />
    )
  }

  return (
    <>
      <ChargesTable charges={query.data.items} />
      <Pagination
        page={query.data.page}
        pageCount={Math.ceil(query.data.total / query.data.pageSize)}
        onPageChange={onPageChange}
        summary={buildSummary(query.data)}
      />
    </>
  )
}

function buildSummary(page: ChargePage): string {
  const shown = page.items.length
  return `Mostrando ${formatNumber(shown)} de ${formatNumber(page.total)} cobranças`
}
