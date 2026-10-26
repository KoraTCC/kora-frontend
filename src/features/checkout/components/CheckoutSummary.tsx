import { Check } from 'lucide-react'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { formatBRL, formatCrypto, formatPercent } from '#/lib/money'
import { NETWORK_META } from '#/features/networks/networks'
import type { Checkout } from '../types'
import { MerchantBadge } from './MerchantBadge'

type CheckoutSummaryProps = {
  checkout: Checkout
}

/** Order facts beside the payment: what, for whom, at which rate. */
export function CheckoutSummary({ checkout }: CheckoutSummaryProps) {
  const network = NETWORK_META[checkout.network]

  return (
    <aside className="bg-canvas border-line-soft flex flex-col gap-6 border-b p-5 sm:p-8 lg:border-r lg:border-b-0">
      <MerchantBadge name={checkout.merchant.name} isProtectedNoteVisible />

      <div className="flex flex-col gap-1">
        <p className="text-muted text-xs">Valor a pagar</p>
        <p className="font-display text-ink text-[30px] font-bold tracking-tight sm:text-[34px]">
          {formatBRL(checkout.amountCents)}
        </p>
        <p className="text-dim font-mono text-[11px]">
          {formatCrypto(checkout.cryptoAmount, checkout.asset)}
        </p>
      </div>

      <div className="border-line-soft flex flex-col gap-5 border-t pt-5">
        <DescriptionList
          items={[
            { label: 'Pedido', value: checkout.reference },
            { label: 'Cobrança', value: checkout.chargeId },
            { label: 'Rede', value: network.label },
          ]}
        />
        <div className="border-line-soft border-t pt-5">
          <DescriptionList
            items={[
              {
                label: 'Cotação',
                value: `1 ${checkout.asset} = ${formatBRL(checkout.rateCents)}`,
              },
              {
                label: 'Tolerância',
                value: `± ${formatPercent(checkout.tolerance)}`,
              },
            ]}
          />
        </div>
      </div>

      <div className="mt-auto hidden flex-col gap-2 lg:flex">
        <p className="text-ink-soft flex items-center gap-2 text-[13px]">
          <span
            aria-hidden
            className="bg-lime text-on-lime flex size-4 items-center justify-center rounded-[4px]"
          >
            <Check size={11} strokeWidth={3} />
          </span>
          Sem custódia · você recebe na sua carteira
        </p>
        <p className="text-dim font-mono text-[10px]">
          Somente testnet · Sepolia e Amoy
        </p>
      </div>
    </aside>
  )
}
