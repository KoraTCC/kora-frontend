import { Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { ApiError } from '#/lib/http'
import type { useCharge } from '../hooks/useCharges'
import { ChargeConfirmationsCard } from './ChargeConfirmationsCard'
import { ChargeOrderCard } from './ChargeOrderCard'
import { ChargeOverview } from './ChargeOverview'
import { ChargeReconciliationCard } from './ChargeReconciliationCard'
import { ChargeSummaryCard } from './ChargeSummaryCard'
import { ChargeTimelineCard } from './ChargeTimelineCard'
import { ChargeTransactionCard } from './ChargeTransactionCard'
import { ChargeWebhooksCard } from './ChargeWebhooksCard'

type ChargeDetailViewProps = {
  query: ReturnType<typeof useCharge>
}

export function ChargeDetailView({ query }: ChargeDetailViewProps) {
  if (query.isPending) {
    return (
      <Card>
        <Skeleton lines={10} label="Carregando cobrança…" />
      </Card>
    )
  }
  if (isNotFound(query.error)) {
    return (
      <Card>
        <EmptyState
          title="Cobrança não encontrada"
          description="Confira o ID ou volte para a lista de cobranças."
          action={
            <Link
              to="/charges"
              className={buttonClasses({ variant: 'secondary', size: 'sm' })}
            >
              Ver cobranças
            </Link>
          }
        />
      </Card>
    )
  }
  if (query.isError) {
    return (
      <Card>
        <ErrorState onRetry={() => void query.refetch()} />
      </Card>
    )
  }

  const charge = query.data

  return (
    <>
      <ChargeOverview charge={charge} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_372px]">
        <div className="flex min-w-0 flex-col gap-4">
          <ChargeTimelineCard events={charge.timeline} />
          <ChargeTransactionCard charge={charge} />
          <ChargeWebhooksCard attempts={charge.webhookAttempts} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ChargeSummaryCard charge={charge} />
          <ChargeOrderCard charge={charge} />
          <ChargeReconciliationCard charge={charge} />
          <ChargeConfirmationsCard charge={charge} />
        </div>
      </div>
    </>
  )
}

function isNotFound(error: Error | null): boolean {
  return error instanceof ApiError && error.status === 404
}
