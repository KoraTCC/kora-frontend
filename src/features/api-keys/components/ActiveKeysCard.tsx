import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Modal } from '#/components/ui/Modal'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { formatDate, formatRelative } from '#/lib/date'
import { useApiKeys, useRevokeApiKey } from '../hooks/useApiKeys'
import type { ApiKey } from '../types'

const KIND_LABELS: Record<ApiKey['kind'], string> = {
  publishable: 'Publicável',
  secret: 'Secreta',
}

export function ActiveKeysCard() {
  const { data: keys, isPending, isError, refetch } = useApiKeys()
  const revoke = useRevokeApiKey()
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null)

  function handleConfirmRevoke() {
    if (!keyToRevoke) return
    revoke.mutate(keyToRevoke.id, { onSuccess: () => setKeyToRevoke(null) })
  }

  const revokeError = revoke.isError
    ? 'Não foi possível revogar. Tente de novo.'
    : undefined
  const count = (
    <span className="text-dim font-mono text-[10px]">{keys?.length ?? ''}</span>
  )

  return (
    <Card title="Chaves ativas" action={count} isFlush>
      <ActiveKeysBody
        keys={keys}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onRevoke={setKeyToRevoke}
      />

      <Modal
        open={keyToRevoke !== null}
        onClose={() => setKeyToRevoke(null)}
        title="Revogar chave"
        description="Integrações que usam esta chave param de funcionar na hora."
        size="sm"
        footer={
          <>
            <Button
              variant="danger"
              isBlock
              onClick={handleConfirmRevoke}
              disabled={revoke.isPending}
            >
              Revogar {keyToRevoke?.maskedKey}
            </Button>
            <Button
              variant="ghost"
              isBlock
              onClick={() => setKeyToRevoke(null)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <FormError message={revokeError} />
      </Modal>
    </Card>
  )
}

type ActiveKeysBodyProps = {
  keys?: ReadonlyArray<ApiKey>
  isPending: boolean
  isError: boolean
  onRetry: () => void
  onRevoke: (key: ApiKey) => void
}

function ActiveKeysBody({
  keys,
  isPending,
  isError,
  onRetry,
  onRevoke,
}: ActiveKeysBodyProps) {
  if (isPending)
    return (
      <div className="p-4">
        <Skeleton lines={4} />
      </div>
    )
  if (isError || !keys)
    return (
      <div className="p-4">
        <ErrorState onRetry={onRetry} />
      </div>
    )
  if (!keys.length) return <EmptyState title="Nenhuma chave ativa" />

  return (
    <ul>
      {keys.map((key) => (
        <li
          key={key.id}
          className="border-line-soft flex items-center justify-between gap-3 border-t px-4 py-3 first:border-t-0 sm:px-[18px]"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-ink flex flex-wrap items-center gap-2 font-mono text-xs">
              {key.maskedKey}
              {key.lastUsedAt ? null : (
                <StatusBadge tone="expired">Sem uso</StatusBadge>
              )}
            </p>
            <p className="text-dim font-mono text-[10px]">{describeKey(key)}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onRevoke(key)}>
            Revogar
          </Button>
        </li>
      ))}
    </ul>
  )
}

function describeKey(key: ApiKey): string {
  const lastUse = key.lastUsedAt
    ? `último uso ${formatRelative(key.lastUsedAt)}`
    : 'nunca usada'
  return `${KIND_LABELS[key.kind]} · criada ${formatDate(key.createdAt)} · ${lastUse}`
}
