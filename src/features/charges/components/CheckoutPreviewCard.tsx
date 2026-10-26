import { Lock } from 'lucide-react'
import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { formatBRL, formatCrypto } from '#/lib/money'
import { formatCountdown } from '#/lib/time'
import { NETWORK_META, shortenAddress } from '#/features/networks/networks'
import type { Network } from '#/features/networks/networks'
import { estimateCryptoAmount } from '../quote'

type CheckoutPreviewCardProps = {
  merchantName: string
  description: string
  amountCents: number
  network: Network
  expiresInMinutes: number
  walletAddress?: string
}

/** Live preview of what the customer will see. */
export function CheckoutPreviewCard({
  merchantName,
  description,
  amountCents,
  network,
  expiresInMinutes,
  walletAddress,
}: CheckoutPreviewCardProps) {
  const meta = NETWORK_META[network]
  const cryptoAmount = formatCrypto(
    estimateCryptoAmount(amountCents, network),
    meta.asset,
  )

  return (
    <Card title="Prévia do checkout">
      <div className="bg-canvas border-line flex flex-col gap-3 rounded-[12px] border p-4">
        <div className="border-line-soft flex items-center justify-between border-b pb-3">
          <p className="text-ink text-[13px] font-semibold">{merchantName}</p>
          <p className="text-dim flex items-center gap-1 font-mono text-[10px]">
            <Lock size={10} aria-hidden /> via Kora
          </p>
        </div>
        <p className="text-muted text-xs">{description || 'Sem descrição'}</p>
        <p className="text-ink font-mono text-2xl sm:text-[26px]">
          {formatBRL(amountCents)}
        </p>
        <p className="text-dim font-mono text-[10px]">
          ≈ {cryptoAmount} · {meta.label}
        </p>
        <div className="flex justify-between font-mono text-[10px]">
          <span className="text-dim">Expira em</span>
          <span className="text-status-pending">
            {formatCountdown(expiresInMinutes * 60)}
          </span>
        </div>
      </div>
      <DescriptionList
        items={[
          { label: 'Rede', value: meta.label },
          { label: 'Confirmações exigidas', value: meta.requiredConfirmations },
          {
            label: 'Carteira de destino',
            value: walletAddress ? shortenAddress(walletAddress) : '—',
          },
        ]}
      />
    </Card>
  )
}
