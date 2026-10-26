import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { ApiError } from '#/lib/http'
import { formatCrypto } from '#/lib/money'
import { NETWORK_META } from '#/features/networks/networks'
import { useCheckout, useRestartCheckout } from '../hooks/useCheckout'
import type { Checkout, PaymentMethod } from '../types'
import { AwaitingPayment } from './AwaitingPayment'
import { CheckoutResult } from './CheckoutResult'
import { ConfirmingPayment } from './ConfirmingPayment'

type CheckoutViewProps = {
  chargeId: string
  method: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

export function CheckoutView({
  chargeId,
  method,
  onMethodChange,
}: CheckoutViewProps) {
  const query = useCheckout(chargeId)
  const restart = useRestartCheckout(chargeId)

  if (query.isPending) {
    return (
      <div className="p-8">
        <Skeleton lines={8} label="Carregando pagamento…" />
      </div>
    )
  }
  if (query.error instanceof ApiError && query.error.status === 404) {
    return (
      <EmptyState
        title="Cobrança não encontrada"
        description="Confira o link com a loja. Ele pode ter sido digitado errado ou removido."
      />
    )
  }
  if (query.isError) {
    return (
      <div className="p-8">
        <Card>
          <ErrorState onRetry={() => void query.refetch()} />
        </Card>
      </div>
    )
  }

  const checkout = query.data

  switch (checkout.status) {
    case 'pending':
      return (
        <AwaitingPayment
          key={checkout.expiresAt}
          checkout={checkout}
          method={method}
          onMethodChange={onMethodChange}
        />
      )
    case 'detected':
      return <ConfirmingPayment checkout={checkout} />
    case 'confirmed':
      return (
        <CheckoutResult
          checkout={checkout}
          outcome="confirmed"
          facts={successFacts(checkout)}
        />
      )
    case 'failed':
    case 'expired':
      return (
        <CheckoutResult
          checkout={checkout}
          outcome={checkout.status}
          facts={failureFacts(checkout)}
          onRetry={() => restart.mutate()}
          isRetrying={restart.isPending}
        />
      )
  }
}

function successFacts(checkout: Checkout) {
  return [
    {
      label: 'Valor pago',
      value: formatCrypto(checkout.cryptoAmount, checkout.asset),
    },
    { label: 'Referência', value: checkout.reference },
    {
      label: 'Confirmações',
      value: `${checkout.confirmations}/${checkout.requiredConfirmations}`,
      tone: 'positive' as const,
    },
  ]
}

function failureFacts(checkout: Checkout) {
  return [
    {
      label: 'Motivo',
      value: checkout.failureReason ?? 'Prazo esgotado',
      tone: 'danger' as const,
    },
    { label: 'Cobrança', value: checkout.chargeId },
    { label: 'Rede', value: NETWORK_META[checkout.network].fullLabel },
  ]
}
