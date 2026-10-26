import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ProgressBar } from '#/components/ui/ProgressBar'
import {
  NETWORKS,
  NETWORK_META,
  shortenAddress,
} from '#/features/networks/networks'
import { useWallets } from '#/features/wallets/hooks/useWallets'
import { formatBRLCompact } from '#/lib/money'

export function WalletsAside() {
  const { data: wallets = [] } = useWallets()
  const maxSettled = Math.max(
    ...wallets.map((wallet) => wallet.settledLast7dCents),
    1,
  )

  return (
    <>
      <Callout tone="warning">
        Só é possível liberar mainnet depois de verificar a posse de cada
        carteira assinando uma mensagem.
      </Callout>
      <Card title="Confirmações exigidas">
        <p className="text-dim -mt-1 text-[11px]">
          Quantos blocos a Kora espera antes de marcar a cobrança como
          confirmada.
        </p>
        <DescriptionList
          items={NETWORKS.map((network) => ({
            label: NETWORK_META[network].fullLabel,
            value: `${NETWORK_META[network].requiredConfirmations} blocos · ${NETWORK_META[network].averageConfirmation}`,
          }))}
        />
      </Card>
      <Card title="Liquidação por carteira">
        <ul className="flex flex-col gap-3">
          {wallets.map((wallet) => (
            <li key={wallet.id} className="flex items-center gap-3">
              <span
                aria-hidden
                className="border-line-strong text-muted flex size-8 flex-none items-center justify-center rounded-full border font-mono text-xs"
              >
                {NETWORK_META[wallet.network].symbol}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex justify-between gap-2 font-mono text-[11px]">
                  <span className="text-ink">
                    {shortenAddress(wallet.address)}
                  </span>
                  <span className="text-muted">
                    {formatBRLCompact(wallet.settledLast7dCents)}
                  </span>
                </div>
                <ProgressBar
                  value={wallet.settledLast7dCents / maxSettled}
                  label={`Liquidado em ${shortenAddress(wallet.address)}`}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="text-dim text-[11px]">
          Total liquidado nos últimos 7 dias, por endereço de destino.
        </p>
      </Card>
    </>
  )
}
