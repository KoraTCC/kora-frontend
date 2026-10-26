import { StatusBadge } from '#/components/ui/StatusBadge'
import { CHARGE_STATUS_META } from '../chargeStatus'
import type { ChargeStatus } from '../types'

type ChargeStatusBadgeProps = {
  status: ChargeStatus
  variant?: 'outline' | 'plain'
}

export function ChargeStatusBadge({ status, variant }: ChargeStatusBadgeProps) {
  const meta = CHARGE_STATUS_META[status]
  return (
    <StatusBadge tone={meta.tone} variant={variant}>
      {meta.label}
    </StatusBadge>
  )
}
