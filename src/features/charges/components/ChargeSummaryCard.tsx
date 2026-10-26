import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import type { DescriptionItem } from '#/components/ui/DescriptionList'
import { formatDayTime } from '#/lib/date'
import { formatBRL, formatCrypto, formatPercent } from '#/lib/money'
import { NETWORK_META } from '#/features/networks/networks'
import type { ChargeDetail } from '../types'

type ChargeSummaryCardProps = {
  charge: ChargeDetail
}

export function ChargeSummaryCard({ charge }: ChargeSummaryCardProps) {
  const received = charge.receivedCryptoAmount
  const items: Array<DescriptionItem> = [
    { label: 'Valor cobrado', value: formatBRL(charge.amountCents) },
    {
      label: 'Valor em cripto',
      value: formatCrypto(charge.cryptoAmount, charge.asset),
    },
    {
      label: 'Valor recebido',
      value: received ? formatCrypto(received, charge.asset) : '—',
      tone: received ? 'positive' : 'default',
    },
    {
      label: 'Cotação travada',
      value: `${formatBRL(charge.lockedRateCents)} / ${charge.asset}`,
    },
    { label: 'Tolerância', value: `± ${formatPercent(charge.tolerance)}` },
    { label: 'Rede', value: NETWORK_META[charge.network].label },
    {
      label: 'Confirmações',
      value: `${charge.confirmations} / ${charge.requiredConfirmations}`,
    },
    {
      label: 'Expira em',
      value: charge.expiresAt ? formatDayTime(charge.expiresAt) : '—',
    },
  ]

  return (
    <Card title="Resumo">
      <DescriptionList items={items} />
    </Card>
  )
}
