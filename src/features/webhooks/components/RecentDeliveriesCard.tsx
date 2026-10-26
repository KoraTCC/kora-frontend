import { useState } from 'react'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Select } from '#/components/ui/Select'
import { Skeleton } from '#/components/ui/Skeleton'
import { LiveTag } from '#/components/ui/LiveTag'
import { DELIVERY_RESULT_META } from '../deliveryResult'
import { useRecentDeliveries } from '../hooks/useWebhooks'
import { DELIVERY_RESULTS, deliveryResultSchema } from '../schemas'
import type { DeliveryResult } from '../types'
import { DeliveriesTable } from './DeliveriesTable'

const RESULT_OPTIONS = [
  { value: '', label: 'Status' },
  ...DELIVERY_RESULTS.map((result) => ({
    value: result,
    label: DELIVERY_RESULT_META[result].label,
  })),
]

export function RecentDeliveriesCard() {
  const query = useRecentDeliveries()
  const [result, setResult] = useState<DeliveryResult>()

  function handleResultChange(value: string) {
    const parsed = deliveryResultSchema.safeParse(value)
    setResult(parsed.success ? parsed.data : undefined)
  }

  return (
    <Card
      title="Tentativas de entrega"
      isFlush
      action={
        <div className="flex items-center gap-3">
          <Select
            label="Filtrar por resultado"
            isLabelHidden
            size="sm"
            options={RESULT_OPTIONS}
            value={result ?? ''}
            onChange={(event) => handleResultChange(event.target.value)}
            className="w-36"
          />
          <LiveTag />
        </div>
      }
    >
      <RecentDeliveriesBody query={query} result={result} />
    </Card>
  )
}

type RecentDeliveriesBodyProps = {
  query: ReturnType<typeof useRecentDeliveries>
  result?: DeliveryResult
}

function RecentDeliveriesBody({ query, result }: RecentDeliveriesBodyProps) {
  if (query.isPending)
    return (
      <div className="p-4">
        <Skeleton lines={6} />
      </div>
    )
  if (query.isError)
    return (
      <div className="p-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    )

  const deliveries = query.data.filter(
    (delivery) => !result || delivery.result === result,
  )
  if (!deliveries.length)
    return <EmptyState title="Nenhuma entrega com este status" />

  return <DeliveriesTable deliveries={deliveries} />
}
