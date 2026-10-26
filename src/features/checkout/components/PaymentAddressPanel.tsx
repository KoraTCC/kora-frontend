import { QRCodeSVG } from 'qrcode.react'
import { Button, buttonClasses } from '#/components/ui/Button'
import { CopyField } from '#/components/ui/CopyField'
import { useCopyToClipboard } from '#/hooks/useCopyToClipboard'
import { formatBRL, formatCrypto } from '#/lib/money'
import type { Checkout } from '../types'

type PaymentAddressPanelProps = {
  checkout: Checkout
  paymentUri: string
}

/** Figma "Checkout B": the exact amount and address lead, the QR is secondary. */
export function PaymentAddressPanel({
  checkout,
  paymentUri,
}: PaymentAddressPanelProps) {
  const { state, copy } = useCopyToClipboard()
  const copyLabel = state === 'copied' ? 'Dados copiados' : 'Copiar dados'
  const paymentData = `${checkout.cryptoAmount} ${checkout.asset}\n${checkout.address}`

  return (
    <div className="flex flex-col gap-5">
      <section className="bg-lime-bg/40 border-lime-line flex flex-col gap-3 rounded-[14px] border p-4">
        <h2 className="font-display text-ink text-lg font-semibold">
          Envie exatamente este valor
        </h2>
        <p className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-ink font-mono text-2xl sm:text-[30px]">
            {checkout.cryptoAmount} {checkout.asset}
          </span>
          <span className="text-dim font-mono text-[11px]">
            ≈ {formatBRL(checkout.amountCents)}
          </span>
        </p>
        <CopyField value={checkout.address} label="Endereço de pagamento" />
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto flex-none rounded-[14px] bg-white p-3 sm:mx-0">
          <QRCodeSVG
            value={paymentUri}
            size={128}
            marginSize={0}
            title={`QR code para pagar ${formatCrypto(checkout.cryptoAmount, checkout.asset)}`}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-ink text-[13px] font-semibold">
            Prefere escanear?
          </p>
          <p className="text-muted text-[13px] leading-relaxed">
            Use o QR ao lado na sua carteira. Enviar um valor diferente do
            indicado marca a cobrança como parcial.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={paymentUri} className={buttonClasses({ size: 'sm' })}>
              Abrir na carteira
            </a>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void copy(paymentData)}
            >
              <span aria-live="polite">{copyLabel}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
