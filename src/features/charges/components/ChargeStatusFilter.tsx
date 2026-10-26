import { PillGroup } from '#/components/ui/PillGroup'
import type { PillOption } from '#/components/ui/PillGroup'
import { CHARGE_STATUS_META } from '../chargeStatus'
import { CHARGE_STATUSES } from '../schemas'
import type { ChargeStatus } from '../types'

export type ChargeStatusFilterValue = ChargeStatus | 'all'

type ChargeStatusFilterProps = {
  value: ChargeStatusFilterValue
  onChange: (value: ChargeStatusFilterValue) => void
  counts: Record<ChargeStatus, number>
  total: number
}

export function ChargeStatusFilter({
  value,
  onChange,
  counts,
  total,
}: ChargeStatusFilterProps) {
  const options: Array<PillOption<ChargeStatusFilterValue>> = [
    { value: 'all', label: `Todas · ${total}` },
    ...CHARGE_STATUSES.map((status) => ({
      value: status,
      label: `${CHARGE_STATUS_META[status].plural} · ${counts[status]}`,
    })),
  ]

  return (
    <PillGroup
      label="Filtrar por status"
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}
