import { Link } from '@tanstack/react-router'
import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { EmptyState } from '#/components/ui/EmptyState'
import { Pagination } from '#/components/ui/Pagination'
import { formatRelative } from '#/lib/date'
import { formatNumber } from '#/lib/money'
import type { AuditEntry, AuditPage, AuditSearch } from '../types'

export function AuditTable({
  data,
  search,
  onPageChange,
}: {
  data: AuditPage
  search: AuditSearch
  onPageChange: (page: number) => void
}) {
  if (!data.items.length)
    return <EmptyState title="Nenhum registro encontrado" />

  const columns: Array<Column<AuditEntry>> = [
    {
      key: 'actor',
      header: 'Ator',
      cell: (entry) => (
        <span className="text-ink">
          {entry.isSystem ? 'Sistema' : `Operador ${entry.actor}`}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Ação',
      cell: (entry) => (
        <Link
          to="/admin/audit"
          search={{ ...search, entry: entry.id }}
          className="text-ink hover:text-lime underline-offset-2 hover:underline"
        >
          {entry.action}
        </Link>
      ),
      className: 'w-full',
    },
    {
      key: 'target',
      header: 'Alvo',
      cell: (entry) => (
        <span className="text-muted font-mono text-[11px]">{entry.target}</span>
      ),
    },
    {
      key: 'origin',
      header: 'Origem',
      cell: (entry) => (
        <span className="text-dim font-mono text-[11px]">
          {entry.origin ?? '—'}
        </span>
      ),
    },
    {
      key: 'when',
      header: 'Quando',
      cell: (entry) => (
        <span className="text-dim font-mono text-[11px]">
          {formatRelative(entry.at)}
        </span>
      ),
    },
  ]
  const first = (data.page - 1) * data.pageSize + 1

  return (
    <>
      <DataTable
        caption="Registros de auditoria"
        columns={columns}
        rows={data.items}
        getRowKey={(entry) => entry.id}
        minWidth={720}
      />
      <Pagination
        page={data.page}
        pageCount={Math.ceil(data.total / data.pageSize)}
        onPageChange={onPageChange}
        summary={`${first}–${first + data.items.length - 1} de ${formatNumber(data.total)} registros`}
      />
    </>
  )
}
