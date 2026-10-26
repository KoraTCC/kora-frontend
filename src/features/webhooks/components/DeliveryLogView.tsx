import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Pagination } from '#/components/ui/Pagination'
import { PillGroup } from '#/components/ui/PillGroup'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatNumber } from '#/lib/money'
import { DELIVERY_RESULT_META } from '../deliveryResult'
import { useDeliveries } from '../hooks/useWebhooks'
import { DELIVERY_RESULTS, deliveryResultSchema } from '../schemas'
import type { DeliveryLogSearch, DeliveryPage } from '../types'
import { DeliveriesTable } from './DeliveriesTable'
import { LatestFailureCard } from './LatestFailureCard'

const PAGE_SIZE = 16

type DeliveryLogViewProps = {
  search: DeliveryLogSearch
  onSearchChange: (next: DeliveryLogSearch) => void
}

export function DeliveryLogView({
  search,
  onSearchChange,
}: DeliveryLogViewProps) {
  const query = useDeliveries({
    result: search.result,
    page: search.page ?? 1,
    pageSize: PAGE_SIZE,
  })

  function handleResultChange(value: string) {
    const parsed = deliveryResultSchema.safeParse(value)
    onSearchChange({
      result: parsed.success ? parsed.data : undefined,
      page: undefined,
    })
  }

  return (
    <>
      {query.data ? (
        <PillGroup
          label="Filtrar por resultado"
          options={buildResultOptions(query.data.counts)}
          value={search.result ?? 'all'}
          onChange={handleResultChange}
        />
      ) : null}
      <Card isFlush>
        <DeliveryLogBody
          query={query}
          onPageChange={(page) => onSearchChange({ ...search, page })}
        />
      </Card>
      <LatestFailureCard />
    </>
  )
}

function buildResultOptions(counts: DeliveryPage['counts']) {
  return [
    { value: 'all', label: `Todas · ${formatNumber(counts.all)}` },
    ...DELIVERY_RESULTS.map((result) => ({
      value: result,
      label: `${DELIVERY_RESULT_META[result].label} · ${formatNumber(counts[result])}`,
    })),
  ]
}

type DeliveryLogBodyProps = {
  query: ReturnType<typeof useDeliveries>
  onPageChange: (page: number) => void
}

function DeliveryLogBody({ query, onPageChange }: DeliveryLogBodyProps) {
  if (query.isPending)
    return (
      <div className="p-4">
        <Skeleton lines={8} />
      </div>
    )
  if (query.isError)
    return (
      <div className="p-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    )
  if (!query.data.items.length)
    return <EmptyState title="Nenhuma entrega com este resultado" />

  const { items, page, pageSize, total } = query.data

  return (
    <>
      <DeliveriesTable deliveries={items} />
      <Pagination
        page={page}
        pageCount={Math.ceil(total / pageSize)}
        onPageChange={onPageChange}
        summary={`Mostrando ${items.length} de ${formatNumber(total)} entregas`}
      />
    </>
  )
}
