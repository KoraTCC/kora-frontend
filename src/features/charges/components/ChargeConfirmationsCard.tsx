import { Card } from '#/components/ui/Card'
import { ProgressBar } from '#/components/ui/ProgressBar'
import { formatNumber } from '#/lib/money'
import { NETWORK_META } from '#/features/networks/networks'
import type { ChargeDetail } from '../types'

type ChargeConfirmationsCardProps = {
  charge: ChargeDetail
}

export function ChargeConfirmationsCard({
  charge,
}: ChargeConfirmationsCardProps) {
  const network = NETWORK_META[charge.network]
  const progress = charge.confirmations / charge.requiredConfirmations
  const blockLabel = charge.blockNumber
    ? `bloco ${formatNumber(charge.blockNumber)}`
    : 'aguardando bloco'

  return (
    <Card title="Confirmações na rede">
      <ProgressBar value={progress} label="Confirmações na rede" size="md" />
      <div className="flex justify-between font-mono text-[10px]">
        <span className="text-dim">{blockLabel}</span>
        <span className="text-lime">
          {charge.confirmations} de {charge.requiredConfirmations}
        </span>
      </div>
      <p className="text-dim text-[11px] leading-relaxed">
        A Kora exige {network.requiredConfirmations} confirmações em{' '}
        {network.label} antes de marcar a cobrança como confirmada e disparar o
        webhook.
      </p>
    </Card>
  )
}
