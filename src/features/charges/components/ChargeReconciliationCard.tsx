import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import type { DescriptionItem } from '#/components/ui/DescriptionList'
import { formatBRL, formatCrypto, formatSignedPercent } from '#/lib/money'
import type { ChargeDetail } from '../types'

type ChargeReconciliationCardProps = {
  charge: ChargeDetail
}

export function ChargeReconciliationCard({
  charge,
}: ChargeReconciliationCardProps) {
  const {
    rateAtCreationCents,
    rateAtConfirmationCents,
    networkFee,
    netAmount,
  } = charge.reconciliation
  const variation = rateAtConfirmationCents
    ? rateAtConfirmationCents / rateAtCreationCents - 1
    : null

  const items: Array<DescriptionItem> = [
    { label: 'Cotação na criação', value: formatBRL(rateAtCreationCents) },
    {
      label: 'Cotação na confirmação',
      value: rateAtConfirmationCents ? formatBRL(rateAtConfirmationCents) : '—',
    },
    {
      label: 'Variação no período',
      value: variation === null ? '—' : formatSignedPercent(variation, 2),
      tone: variation && variation > 0 ? 'positive' : 'default',
    },
    {
      label: 'Taxa de rede paga',
      value: networkFee ? formatCrypto(networkFee, charge.asset) : '—',
    },
    {
      label: 'Valor líquido na carteira',
      value: netAmount ? formatCrypto(netAmount, charge.asset) : '—',
    },
  ]

  return (
    <Card title="Conciliação">
      <DescriptionList items={items} />
    </Card>
  )
}
