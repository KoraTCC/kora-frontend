import { Check, Clock, ExternalLink, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, buttonClasses } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { DescriptionList } from '#/components/ui/DescriptionList'
import type { DescriptionItem } from '#/components/ui/DescriptionList'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { cn } from '#/lib/cn'
import { explorerTxUrl } from '#/features/networks/networks'
import type { Checkout } from '../types'
import { CheckoutCard } from './CheckoutCard'
import { MerchantBadge } from './MerchantBadge'

export type CheckoutOutcome = 'confirmed' | 'failed' | 'expired'

type CheckoutResultProps = {
  checkout: Checkout
  outcome: CheckoutOutcome
  facts: ReadonlyArray<DescriptionItem>
  onRetry?: () => void
  isRetrying?: boolean
}

const OUTCOME_META: Record<
  CheckoutOutcome,
  {
    title: string
    description: string
    icon: ReactNode
    iconClasses: string
    badge?: ReactNode
    notice?: string
  }
> = {
  confirmed: {
    title: 'Pagamento confirmado',
    description: 'Tudo certo. A loja já foi avisada e vai liberar seu pedido.',
    icon: <Check size={44} strokeWidth={2.5} aria-hidden />,
    iconClasses: 'bg-lime-bg border-status-confirmed-border text-lime',
  },
  failed: {
    title: 'O pagamento não foi concluído',
    description:
      'A transação foi revertida pela rede e nenhum valor saiu da sua carteira. Você pode tentar novamente.',
    icon: <X size={40} aria-hidden />,
    iconClasses:
      'bg-status-failed-bg border-status-failed-border text-status-failed',
    badge: <StatusBadge tone="failed">Falhou</StatusBadge>,
    notice:
      'Nenhum valor foi debitado. Confira o saldo e a taxa de rede antes de tentar de novo.',
  },
  expired: {
    title: 'O tempo para pagar acabou',
    description:
      'A cotação desta cobrança expirou. Gere uma nova para pagar com o valor atualizado.',
    icon: <Clock size={38} aria-hidden />,
    iconClasses: 'bg-surface-2 border-line-strong text-muted',
    badge: <StatusBadge tone="expired">Expirado</StatusBadge>,
    notice:
      'Se você enviou o pagamento depois do prazo, a loja verá a transação e entrará em contato.',
  },
}

/** Final screen of a checkout: success, failure or expiry share one layout. */
export function CheckoutResult({
  checkout,
  outcome,
  facts,
  onRetry,
  isRetrying,
}: CheckoutResultProps) {
  const meta = OUTCOME_META[outcome]
  const explorerUrl = checkout.txHash
    ? explorerTxUrl(checkout.network, checkout.txHash)
    : null
  const isSuccess = outcome === 'confirmed'
  const retryLabel = isRetrying ? 'Gerando…' : 'Tentar novamente'

  return (
    <CheckoutCard>
      {meta.badge ? (
        <div className="flex items-center justify-between gap-3">
          <MerchantBadge name={checkout.merchant.name} />
          {meta.badge}
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className={cn(
            'flex size-24 items-center justify-center rounded-full border',
            meta.iconClasses,
          )}
        >
          {meta.icon}
        </span>
        <h1 className="font-display text-ink text-2xl font-semibold sm:text-[28px]">
          {meta.title}
        </h1>
        <p className="text-muted text-[13px] leading-relaxed">
          {meta.description}
        </p>
      </div>

      <div className="bg-surface border-line flex flex-col gap-4 rounded-[14px] border p-4">
        <DescriptionList items={facts} />
        {checkout.txHash ? (
          <div className="border-line-soft flex flex-col gap-1 border-t pt-3">
            <p className="text-dim font-mono text-[9px] tracking-[0.08em] uppercase">
              Hash da transação
            </p>
            <p className="text-ink truncate font-mono text-xs">
              {checkout.txHash}
            </p>
          </div>
        ) : null}
      </div>

      {meta.notice ? (
        <Callout tone={isSuccess ? 'neutral' : 'danger'}>{meta.notice}</Callout>
      ) : null}

      <ResultActions
        checkout={checkout}
        isSuccess={isSuccess}
        explorerUrl={explorerUrl}
        onRetry={onRetry}
        retryLabel={retryLabel}
        isRetrying={isRetrying}
      />
    </CheckoutCard>
  )
}

type ResultActionsProps = {
  checkout: Checkout
  isSuccess: boolean
  explorerUrl: string | null
  onRetry?: () => void
  retryLabel: string
  isRetrying?: boolean
}

function ResultActions({
  checkout,
  isSuccess,
  explorerUrl,
  onRetry,
  retryLabel,
  isRetrying,
}: ResultActionsProps) {
  const backToStore = checkout.merchant.returnUrl

  if (!isSuccess) {
    return (
      <div className="flex flex-col gap-2">
        <Button isBlock onClick={onRetry} disabled={isRetrying}>
          {retryLabel}
        </Button>
        <a
          href={backToStore}
          className={buttonClasses({ variant: 'ghost', isBlock: true })}
        >
          Voltar à loja
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <a href={backToStore} className={buttonClasses({ isBlock: true })}>
        Voltar à loja
      </a>
      {explorerUrl ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonClasses({ variant: 'ghost', isBlock: true })}
        >
          Ver no explorer <ExternalLink size={13} aria-hidden />
        </a>
      ) : null}
    </div>
  )
}
