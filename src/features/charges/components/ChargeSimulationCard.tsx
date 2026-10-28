import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { FormError } from '#/components/ui/FormError'
import { useMerchant } from '#/features/merchant/hooks/useMerchant'
import { useSimulateChargePayment } from '../hooks/useCharges'
import type { ChargeDetail, SimulationOutcome } from '../types'

type ChargeSimulationCardProps = {
  charge: ChargeDetail
}

const OUTCOMES: ReadonlyArray<{
  outcome: SimulationOutcome
  label: string
  variant: 'primary' | 'secondary' | 'danger'
}> = [
  { outcome: 'confirmed', label: 'Pagamento confirmado', variant: 'primary' },
  { outcome: 'partial', label: 'Pagamento parcial', variant: 'secondary' },
  { outcome: 'failed', label: 'Pagamento com falha', variant: 'danger' },
]

/** Test mode only: lets a pending charge be "paid" without a blockchain. */
export function ChargeSimulationCard({ charge }: ChargeSimulationCardProps) {
  const merchant = useMerchant()
  const simulate = useSimulateChargePayment(charge.id)

  const canSimulate =
    merchant.data?.environment === 'test' &&
    (charge.status === 'pending' || charge.status === 'detected')
  if (!canSimulate) return null

  return (
    <Card title="Simular pagamento">
      <div className="flex flex-col gap-3">
        <Callout tone="warning">
          Modo teste: simula a detecção on-chain para demonstrar o fluxo.
        </Callout>
        {OUTCOMES.map(({ outcome, label, variant }) => (
          <Button
            key={outcome}
            variant={variant}
            size="sm"
            isBlock
            disabled={simulate.isPending}
            onClick={() => simulate.mutate(outcome)}
          >
            {label}
          </Button>
        ))}
        <FormError message={simulate.error?.message} />
      </div>
    </Card>
  )
}
