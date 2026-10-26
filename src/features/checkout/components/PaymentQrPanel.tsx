import { QRCodeSVG } from 'qrcode.react'
import { buttonClasses } from '#/components/ui/Button'
import { CopyField } from '#/components/ui/CopyField'
import { formatCrypto } from '#/lib/money'
import type { Checkout } from '../types'

type PaymentQrPanelProps = {
  checkout: Checkout
  paymentUri: string
}

/** Figma "Checkout A": the QR code leads, address and amount to copy beside it. */
export function PaymentQrPanel({ checkout, paymentUri }: PaymentQrPanelProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <div className="mx-auto flex-none rounded-[14px] bg-white p-3 sm:mx-0">
        <QRCodeSVG
          value={paymentUri}
          size={184}
          marginSize={0}
          title={`QR code para pagar ${formatCrypto(checkout.cryptoAmount, checkout.asset)}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h2 className="font-display text-ink text-lg font-semibold">
          Escaneie para pagar
        </h2>
        <p className="text-muted text-[13px] leading-relaxed">
          Abra a carteira, escaneie o código e envie o valor exato. A
          confirmação aparece aqui automaticamente.
        </p>
        <p className="text-dim font-mono text-[10px] tracking-[0.08em] uppercase">
          Endereço
        </p>
        <CopyField value={checkout.address} label="Endereço de pagamento" />
        <p className="text-dim font-mono text-[10px] tracking-[0.08em] uppercase">
          Valor exato
        </p>
        <CopyField
          value={checkout.cryptoAmount}
          displayValue={`${checkout.cryptoAmount} ${checkout.asset}`}
          label="Valor exato"
        />
        <a href={paymentUri} className={buttonClasses({ isBlock: true })}>
          Abrir na carteira
        </a>
      </div>
    </div>
  )
}
