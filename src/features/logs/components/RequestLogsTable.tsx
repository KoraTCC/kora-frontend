import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Pagination } from '#/components/ui/Pagination'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatRelative } from '#/lib/date'
import { formatNumber } from '#/lib/money'
import type { useRequestLogs } from '../hooks/useRequestLogs'
import { httpStatusClass } from '../httpStatus'
import type { RequestLog } from '../types'

const COLUMNS: Array<Column<RequestLog>> = [
  {
    key: 'method',
    header: 'Método',
    cell: (log) => (
      <span className="text-ink font-mono text-[11px]">{log.method}</span>
    ),
  },
  {
    key: 'path',
    header: 'Rota',
    cell: (log) => (
      <span className="text-ink font-mono text-xs">{log.path}</span>
    ),
    className: 'w-full',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (log) => (
      <span
        className={`font-mono text-[11px] ${httpStatusClass(log.statusCode)}`}
      >
        {log.statusCode}
      </span>
    ),
  },
  {
    key: 'latency',
    header: 'Latência',
    cell: (log) => (
      <span className="text-muted font-mono text-[11px]">
        {log.latencyMs} ms
      </span>
    ),
  },
  {
    key: 'when',
    header: 'Quando',
    cell: (log) => (
      <span className="text-dim font-mono text-[11px]">
        {formatRelative(log.at)}
      </span>
    ),
  },
]

type RequestLogsTableProps = {
  query: ReturnType<typeof useRequestLogs>
  onPageChange: (page: number) => void
}

export function RequestLogsTable({
  query,
  onPageChange,
}: RequestLogsTableProps) {
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
  if (!query.data.items.length) {
    return (
      <EmptyState
        title="Nenhuma requisição encontrada"
        description="Ajuste os filtros para ver outras requisições."
      />
    )
  }

  const { items, page, pageSize, total } = query.data

  return (
    <>
      <DataTable
        caption="Requisições à API"
        columns={COLUMNS}
        rows={items}
        getRowKey={(log) => log.id}
        minWidth={640}
      />
      <Pagination
        page={page}
        pageCount={Math.ceil(total / pageSize)}
        onPageChange={onPageChange}
        summary={`Mostrando ${items.length} de ${formatNumber(total)} requisições`}
      />
    </>
  )
}
