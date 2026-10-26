import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Pagination } from '#/components/ui/Pagination'
import { Skeleton } from '#/components/ui/Skeleton'
import type { useAdminMerchants } from '../hooks/useAdmin'
import { MerchantsTable } from './MerchantsTable'

type MerchantsBodyProps = {
  query: ReturnType<typeof useAdminMerchants>
  selectedIds: ReadonlySet<string>
  onToggle: (merchantId: string) => void
  onPageChange: (page: number) => void
}

export function MerchantsBody({
  query,
  selectedIds,
  onToggle,
  onPageChange,
}: MerchantsBodyProps) {
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
    return (
      <EmptyState
        title="Nenhum lojista encontrado"
        description="Ajuste os filtros ou a busca."
      />
    )

  const { items, page, pageSize, total } = query.data
  const first = (page - 1) * pageSize + 1

  return (
    <>
      <MerchantsTable
        merchants={items}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
      <Pagination
        page={page}
        pageCount={Math.ceil(total / pageSize)}
        onPageChange={onPageChange}
        summary={`${first}–${first + items.length - 1} de ${total} lojistas`}
      />
    </>
  )
}
