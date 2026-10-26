import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { formatDayTime } from '#/lib/date'
import { CHARGE_ORIGIN_LABELS } from '../chargeStatus'
import type { ChargeDetail } from '../types'

type ChargeOrderCardProps = {
  charge: ChargeDetail
}

export function ChargeOrderCard({ charge }: ChargeOrderCardProps) {
  return (
    <Card title="Pedido">
      <DescriptionList
        items={[
          { label: 'Referência', value: charge.reference },
          { label: 'Origem', value: CHARGE_ORIGIN_LABELS[charge.origin] },
          { label: 'Cliente', value: charge.customerEmail ?? '—' },
          { label: 'Criada em', value: formatDayTime(charge.createdAt) },
        ]}
      />
    </Card>
  )
}
