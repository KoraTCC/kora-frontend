import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonClasses } from '#/components/ui/Button'
import { Modal } from '#/components/ui/Modal'
import { formatDayTime } from '#/lib/date'
import { formatBRL } from '#/lib/money'
import { NETWORK_META, explorerTxUrl } from '#/features/networks/networks'
import { useResendChargeWebhook } from '../hooks/useCharges'
import type { ChargeDetail } from '../types'
import { ChargeStatusBadge } from './ChargeStatusBadge'

type ChargeOverviewProps = {
  charge: ChargeDetail
}

const RESEND_LABELS = {
  idle: 'Reenviar webhook',
  pending: 'Reenviando…',
  success: 'Webhook reenviado',
  error: 'Falhou — tentar de novo',
} as const

export function ChargeOverview({ charge }: ChargeOverviewProps) {
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  const resend = useResendChargeWebhook()
  const network = NETWORK_META[charge.network]
  const explorerUrl = charge.txHash
    ? explorerTxUrl(charge.network, charge.txHash)
    : null
  const facts = [
    { label: 'Cliente', value: charge.customerEmail ?? '—' },
    { label: 'Rede', value: `${network.label} · ${charge.asset}` },
    { label: 'Criada em', value: formatDayTime(charge.createdAt) },
  ]

  return (
    <section className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-3">
          <p className="font-display text-ink text-[28px] font-bold tracking-tight sm:text-[34px]">
            {formatBRL(charge.amountCents)}
          </p>
          <ChargeStatusBadge status={charge.status} />
        </div>
        <dl className="border-line-soft flex flex-wrap gap-x-6 gap-y-2 sm:border-l sm:pl-6">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt className="text-dim font-mono text-[9px] tracking-[0.08em] uppercase">
                {fact.label}
              </dt>
              <dd className="text-ink-soft font-mono text-[11px]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/pay/$chargeId"
          params={{ chargeId: charge.id }}
          target="_blank"
          className={buttonClasses({ variant: 'secondary', size: 'sm' })}
        >
          Ver página de pagamento
          <ExternalLink size={12} aria-hidden />
        </Link>
        {explorerUrl ? (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses({ variant: 'secondary', size: 'sm' })}
          >
            Ver no explorer
            <ExternalLink size={12} aria-hidden />
          </a>
        ) : null}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => resend.mutate(charge.id)}
          disabled={resend.isPending}
        >
          <span aria-live="polite">{RESEND_LABELS[resend.status]}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsRefundOpen(true)}>
          Reembolsar
        </Button>
      </div>

      <Modal
        open={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        title="Reembolso sem custódia"
        description="A Kora não guarda os fundos: o valor já está na carteira da loja."
        size="sm"
        footer={
          <Button isBlock onClick={() => setIsRefundOpen(false)}>
            Entendi
          </Button>
        }
      >
        <p className="text-ink-soft text-[13px] leading-relaxed">
          Para reembolsar, envie{' '}
          {charge.receivedCryptoAmount ?? charge.cryptoAmount} {charge.asset} da
          sua carteira para o endereço informado pelo cliente. Registre o hash
          da transação no pedido para manter a conciliação.
        </p>
      </Modal>
    </section>
  )
}
