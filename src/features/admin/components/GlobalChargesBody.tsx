import { EmptyState } from '#/components/ui/EmptyState'
import { Pagination } from '#/components/ui/Pagination'
import { formatNumber } from '#/lib/money'
import type { GlobalCharges } from '../types'
import { GlobalChargesTable } from './GlobalChargesTable'

export function GlobalChargesBody({
  data,
  onPageChange,
}: {
  data: GlobalCharges
  onPageChange: (page: number) => void
}) {
  if (!data.items.length)
    return (
      <EmptyState
        title="Nenhuma cobrança encontrada"
        description="Ajuste os filtros ou a busca."
      />
    )

  const first = (data.page - 1) * data.pageSize + 1
  return (
    <>
      <GlobalChargesTable charges={data.items} />
      <Pagination
        page={data.page}
        pageCount={Math.ceil(data.total / data.pageSize)}
        onPageChange={onPageChange}
        summary={`${first}–${first + data.items.length - 1} de ${formatNumber(data.total)}`}
      />
    </>
  )
}
