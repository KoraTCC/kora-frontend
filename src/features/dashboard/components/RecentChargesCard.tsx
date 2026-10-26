import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Select } from '#/components/ui/Select'
import { Skeleton } from '#/components/ui/Skeleton'
import { CHARGE_STATUS_META } from '#/features/charges/chargeStatus'
import { ChargesTable } from '#/features/charges/components/ChargesTable'
import { useChargeList } from '#/features/charges/hooks/useCharges'
import { CHARGE_STATUSES, chargeStatusSchema } from '#/features/charges/schemas'
import type { ChargeStatus } from '#/features/charges/types'

const RECENT_LIMIT = 5

const STATUS_OPTIONS = [
  { value: '', label: 'Status' },
  ...CHARGE_STATUSES.map((status) => ({
    value: status,
    label: CHARGE_STATUS_META[status].plural,
  })),
]

export function RecentChargesCard() {
  const [status, setStatus] = useState<ChargeStatus>()
  const query = useChargeList({ status, page: 1, pageSize: RECENT_LIMIT })

  function handleStatusChange(value: string) {
    const parsed = chargeStatusSchema.safeParse(value)
    setStatus(parsed.success ? parsed.data : undefined)
  }

  return (
    <Card
      title="Cobranças recentes"
      isFlush
      action={
        <div className="flex items-center gap-3">
          <Select
            label="Filtrar por status"
            isLabelHidden
            size="sm"
            options={STATUS_OPTIONS}
            value={status ?? ''}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="w-36"
          />
          <Link
            to="/charges"
            search={{ status }}
            className="text-lime text-xs font-semibold"
          >
            Ver todas
          </Link>
        </div>
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
        <Skeleton lines={5} />
      </div>
    )
  if (query.isError)
    return (
      <div className="p-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    )
  if (!query.data.items.length)
    return <EmptyState title="Nenhuma cobrança com este status" />

  return <ChargesTable charges={query.data.items} variant="compact" />
}
