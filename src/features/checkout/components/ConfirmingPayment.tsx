import { ExternalLink } from 'lucide-react'
import { buttonClasses } from '#/components/ui/Button'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { Timeline } from '#/components/ui/Timeline'
import { formatTime } from '#/lib/date'
import { formatBRL, formatCrypto } from '#/lib/money'
import {
  NETWORK_META,
  explorerTxUrl,
  shortenAddress,
} from '#/features/networks/networks'
import type { Checkout } from '../types'
import { CheckoutCard } from './CheckoutCard'
import { MerchantBadge } from './MerchantBadge'

type ConfirmingPaymentProps = {
  checkout: Checkout
}

/** Payment seen on chain, waiting for confirmations — the page updates on its own. */
export function ConfirmingPayment({ checkout }: ConfirmingPaymentProps) {
  const network = NETWORK_META[checkout.network]
  const missing = checkout.requiredConfirmations - checkout.confirmations
  const confirmationLabel =
    checkout.confirmations === 1 ? 'confirmação' : 'confirmações'
  const facts = [
    { label: 'Pedido', value: checkout.reference },
    { label: 'Rede', value: network.label },
  ]
  const explorerUrl = checkout.txHash
    ? explorerTxUrl(checkout.network, checkout.txHash)
    : null

  return (
    <CheckoutCard>
      <div className="flex items-center justify-between gap-3">
        <MerchantBadge name={checkout.merchant.name} />
        <StatusBadge tone="detected">Detectado</StatusBadge>
      </div>

      <div
        className="flex flex-col items-center gap-3 text-center"
        aria-live="polite"
      >
        <p
          role="img"
          aria-label={`${checkout.confirmations} de ${checkout.requiredConfirmations} confirmações`}
          className="border-status-detected font-display text-ink flex size-[76px] items-center justify-center rounded-full border-2 text-2xl font-bold"
        >
          {checkout.confirmations}/{checkout.requiredConfirmations}
        </p>
        <h1 className="font-display text-ink text-2xl font-semibold">
          Confirmando na rede
        </h1>
        <p className="text-muted max-w-90 text-[13px] leading-relaxed">
          Recebemos sua transação. Ela será confirmada em alguns minutos — pode
          fechar esta página com segurança.
        </p>
      </div>

      <Timeline
        items={[
          {
            id: 'created',
            title: 'Cobrança criada',
            meta: `${formatTime(checkout.createdAt)} · ${formatBRL(checkout.amountCents)} → ${formatCrypto(checkout.cryptoAmount, checkout.asset)}`,
            state: 'done',
          },
          {
            id: 'detected',
            title: 'Pagamento detectado',
            meta: `${checkout.detectedAt ? formatTime(checkout.detectedAt) : '—'} · ${shortenAddress(checkout.txHash ?? '')} · ${checkout.confirmations} ${confirmationLabel}`,
            state: 'current',
          },
          {
            id: 'confirmed',
            title: 'Confirmado',
            meta: `Faltam ${missing} · previsão ${network.averageConfirmation}`,
            state: 'pending',
          },
        ]}
      />

      <dl className="grid grid-cols-2 gap-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="bg-surface border-line flex flex-col gap-1 rounded-[12px] border p-3.5"
          >
            <dt className="text-dim font-mono text-[9px] tracking-[0.08em] uppercase">
              {fact.label}
            </dt>
            <dd className="text-ink font-mono text-xs">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {explorerUrl ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonClasses({ variant: 'secondary', isBlock: true })}
        >
          Ver no explorer <ExternalLink size={13} aria-hidden />
        </a>
      ) : null}
      <p className="text-dim text-center text-[11px]">
        Você pode sair desta página — avisaremos a loja assim que confirmar.
      </p>
    </CheckoutCard>
  )
}
