import { PillGroup } from '#/components/ui/PillGroup'
import { ProgressBar } from '#/components/ui/ProgressBar'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { Stepper } from '#/components/ui/Stepper'
import { useCountdown } from '#/hooks/useCountdown'
import { formatCountdown } from '#/lib/time'
import { NETWORK_META } from '#/features/networks/networks'
import { buildPaymentUri } from '../paymentUri'
import type { Checkout, PaymentMethod } from '../types'
import { CheckoutSummary } from './CheckoutSummary'
import { PaymentAddressPanel } from './PaymentAddressPanel'
import { PaymentQrPanel } from './PaymentQrPanel'

type AwaitingPaymentProps = {
  checkout: Checkout
  method: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

const METHOD_OPTIONS = [
  { value: 'qr', label: 'QR code' },
  { value: 'address', label: 'Endereço' },
] as const

const PAYMENT_STEPS = ['Criada', 'Detectada', 'Confirmada', 'Concluída']

export function AwaitingPayment({
  checkout,
  method,
  onMethodChange,
}: AwaitingPaymentProps) {
  const initialSeconds = Math.max(
    0,
    (new Date(checkout.expiresAt).getTime() - Date.now()) / 1000,
  )
  const { secondsLeft } = useCountdown(initialSeconds)
  const remaining = initialSeconds ? secondsLeft / initialSeconds : 0
  const paymentUri = buildPaymentUri(
    checkout.network,
    checkout.address,
    checkout.cryptoAmount,
  )
  const network = NETWORK_META[checkout.network]
  const Panel = method === 'qr' ? PaymentQrPanel : PaymentAddressPanel

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[392px_minmax(0,1fr)]">
      <CheckoutSummary checkout={checkout} />

      <section className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge tone="pending">Aguardando pagamento</StatusBadge>
            <p role="timer" className="text-muted text-[13px]">
              Expira em{' '}
              <span className="text-status-pending ml-1 font-mono">
                {formatCountdown(secondsLeft)}
              </span>
            </p>
          </div>
          <ProgressBar
            value={remaining}
            tone="pending"
            label="Tempo restante para pagar"
          />
        </div>

        <PillGroup
          label="Como pagar"
          variant="segmented"
          options={METHOD_OPTIONS}
          value={method}
          onChange={onMethodChange}
        />

        <Panel checkout={checkout} paymentUri={paymentUri} />

        <div className="bg-surface border-line flex flex-col gap-4 rounded-[14px] border p-4 sm:p-5">
          <Stepper
            label="Etapas do pagamento"
            steps={PAYMENT_STEPS}
            current={0}
          />
          <p className="text-dim text-center text-[11px]">
            A cobrança é marcada como confirmada após{' '}
            {network.requiredConfirmations} confirmações na rede {network.label}
            .
          </p>
        </div>
      </section>
    </div>
  )
}
