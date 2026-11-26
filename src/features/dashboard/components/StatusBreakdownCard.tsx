import { Card } from '#/components/ui/Card'
import { DistributionBar } from '#/components/ui/DistributionBar'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { CHARGE_STATUS_META } from '#/features/charges/chargeStatus'
import { useChargeStats } from '#/features/charges/hooks/useCharges'
import { CHARGE_STATUSES } from '#/features/charges/schemas'
import { formatNumber, formatPercent } from '#/lib/money'

/** Every charge in the window, split by status — replaces one card per status. */
export function StatusBreakdownCard() {
  const { data, isPending, isError, refetch } = useChargeStats()

  if (isPending)
    return (
      <Card title="Cobranças por status">
        <Skeleton lines={4} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Cobranças por status">
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )
  if (data.total === 0)
    return (
      <Card title="Cobranças por status">
        <EmptyState title="Nenhuma cobrança ainda" />
      </Card>
    )

  const items = CHARGE_STATUSES.filter((status) => data.counts[status] > 0).map(
    (status) => ({
      id: status,
      label: `${CHARGE_STATUS_META[status].plural} · ${formatNumber(data.counts[status])}`,
      share: data.counts[status] / data.total,
      tone: CHARGE_STATUS_META[status].tone,
    }),
  )

  return (
    <Card
      title="Cobranças por status"
      action={
        <span className="text-muted font-mono text-[11px]">
          {formatNumber(data.total)} no total
        </span>
      }
    >
      <DistributionBar
        items={items}
        formatShare={(share) => formatPercent(share, 0)}
      />
    </Card>
  )
}
