import { Card } from '#/components/ui/Card'
import { Timeline } from '#/components/ui/Timeline'
import { NETWORK_META } from '#/features/networks/networks'
import type { Network } from '#/features/networks/networks'

type ChargeNextStepsCardProps = {
  network: Network
}

export function ChargeNextStepsCard({ network }: ChargeNextStepsCardProps) {
  const meta = NETWORK_META[network]

  return (
    <Card title="O que acontece depois">
      <Timeline
        items={[
          {
            id: 'address',
            title: 'Endereço único é gerado',
            meta: 'A cotação fica travada por 30 min',
            state: 'current',
          },
          {
            id: 'payment',
            title: 'Cliente envia o pagamento',
            meta: 'charge.detected no seu webhook',
            state: 'pending',
          },
          {
            id: 'confirm',
            title: 'Rede confirma',
            meta: `${meta.requiredConfirmations} confirmações em ${meta.label} · ${meta.averageConfirmation}`,
            state: 'pending',
          },
          {
            id: 'settle',
            title: 'Valor cai na sua carteira',
            meta: 'charge.confirmed · sem custódia',
            state: 'pending',
          },
        ]}
      />
    </Card>
  )
}
