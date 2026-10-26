import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { NETWORK_META, shortenAddress } from '#/features/networks/networks'
import { useWallets } from '#/features/wallets/hooks/useWallets'
import type { Wallet } from '#/features/wallets/types'
import { useRemoveWallet } from '../hooks/useSettingsQueries'
import { AddWalletDialog } from './AddWalletDialog'

export function WalletsCard() {
  const { data: wallets, isPending, isError, refetch } = useWallets()
  const remove = useRemoveWallet()
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <Card
      title="Carteiras de recebimento"
      isFlush
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
        >
          + Adicionar carteira
        </Button>
      }
    >
      <WalletsBody
        wallets={wallets}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onRemove={(walletId) => remove.mutate(walletId)}
      />
      <AddWalletDialog open={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </Card>
  )
}

type WalletsBodyProps = {
  wallets?: ReadonlyArray<Wallet>
  isPending: boolean
  isError: boolean
  onRetry: () => void
  onRemove: (walletId: string) => void
}

function WalletsBody({
  wallets,
  isPending,
  isError,
  onRetry,
  onRemove,
}: WalletsBodyProps) {
  if (isPending)
    return (
      <div className="p-4">
        <Skeleton lines={4} />
      </div>
    )
  if (isError || !wallets)
    return (
      <div className="p-4">
        <ErrorState onRetry={onRetry} />
      </div>
    )
  if (!wallets.length)
    return (
      <EmptyState
        title="Nenhuma carteira cadastrada"
        description="Cadastre o endereço que vai receber os pagamentos."
      />
    )

  return (
    <ul>
      {wallets.map((wallet) => (
        <li
          key={wallet.id}
          className="border-line-soft flex flex-col gap-3 border-t px-4 py-3.5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:px-[18px]"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-ink font-mono text-xs">
                {shortenAddress(wallet.address, 8)}
              </span>
              <WalletBadge status={wallet.status} />
            </p>
            <p className="text-dim font-mono text-[10px]">
              {describeWallet(wallet)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              {wallet.status === 'verifying' ? 'Verificar' : 'Editar'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRemove(wallet.id)}
            >
              Remover
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function WalletBadge({ status }: { status: Wallet['status'] }) {
  if (status === 'default')
    return <StatusBadge tone="confirmed">Padrão</StatusBadge>
  if (status === 'verifying')
    return <StatusBadge tone="pending">Verificando</StatusBadge>
  return null
}

function describeWallet(wallet: Wallet): string {
  const network = NETWORK_META[wallet.network].fullLabel
  if (wallet.status === 'verifying')
    return `${network} · aguardando assinatura de posse`
  return `${network} · ${wallet.settledCount} cobranças liquidadas`
}
