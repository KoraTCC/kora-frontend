import { Link } from '@tanstack/react-router'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { SkeletonRows } from '#/components/ui/Skeleton'
import { ChargesTable } from '#/features/charges/components/ChargesTable'
import { useChargeList } from '#/features/charges/hooks/useCharges'

const RECENT_LIMIT = 5

/** The latest charges; filtering lives on the charges page. */
export function RecentChargesCard() {
  const query = useChargeList({ page: 1, pageSize: RECENT_LIMIT })

  return (
    <Card
      title="Cobranças recentes"
      isFlush
      action={
        <Link to="/charges" className="text-lime text-xs font-semibold">
          Ver todas →
        </Link>
      }
    >
      <RecentChargesBody query={query} />
    </Card>
  )
}

function RecentChargesBody({
  query,
}: {
  query: ReturnType<typeof useChargeList>
}) {
  if (query.isPending)
    return (
      <div className="p-4">
        <SkeletonRows rows={5} label="Carregando cobranças…" />
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
        title="Nenhuma cobrança ainda"
        description="As cobranças criadas pela API ou pelo painel aparecem aqui."
      />
    )

  return <ChargesTable charges={query.data.items} variant="compact" />
}
