import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { PillGroup } from '#/components/ui/PillGroup'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatNumber } from '#/lib/money'
import { useAudit } from '../hooks/useAdmin'
import { auditSearchSchema } from '../schemas'
import type { AuditPage, AuditSearch } from '../types'
import { AuditTable } from './AuditTable'
import { AuditDetailCard, TopActionsCard } from './AuditSideCards'

const PAGE_SIZE = 8

type AuditViewProps = {
  search: AuditSearch
  onSearchChange: (next: AuditSearch) => void
}

export function AuditView({ search, onSearchChange }: AuditViewProps) {
  const query = useAudit(
    { scope: search.scope, q: search.q, page: search.page },
    PAGE_SIZE,
  )

  if (query.isPending)
    return (
      <Card>
        <Skeleton lines={10} label="Carregando auditoria…" />
      </Card>
    )
  if (query.isError)
    return (
      <Card>
        <ErrorState onRetry={() => void query.refetch()} />
      </Card>
    )

  const { data } = query
  const selected =
    data.items.find((entry) => entry.id === search.entry) ?? data.items.at(0)

  function handleScopeChange(value: string) {
    const parsed = auditSearchSchema.shape.scope.safeParse(value)
    onSearchChange({
      ...search,
      scope: parsed.success ? parsed.data : undefined,
      page: undefined,
      entry: undefined,
    })
  }

  return (
    <>
      <PillGroup
        label="Filtrar registros"
        options={buildScopeOptions(data.counts)}
        value={search.scope ?? 'all'}
        onChange={handleScopeChange}
      />
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card isFlush>
          <AuditTable
            data={data}
            search={search}
            onPageChange={(page) =>
              onSearchChange({ ...search, page, entry: undefined })
            }
          />
        </Card>
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2 2xl:flex 2xl:flex-col">
          {selected ? <AuditDetailCard entry={selected} /> : null}
          <TopActionsCard actions={data.topActions} />
          <Callout>
            Os registros de auditoria não podem ser editados nem apagados e
            ficam retidos por 5 anos.
          </Callout>
        </div>
      </div>
    </>
  )
}

function buildScopeOptions(counts: AuditPage['counts']) {
  return [
    { value: 'all', label: `Tudo · ${formatNumber(counts.all)}` },
    {
      value: 'operators',
      label: `Operadores · ${formatNumber(counts.operators)}`,
    },
    { value: 'system', label: `Sistema · ${formatNumber(counts.system)}` },
    {
      value: 'critical',
      label: `Ações críticas · ${formatNumber(counts.critical)}`,
    },
  ]
}
