import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { CopyField } from '#/components/ui/CopyField'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { useRotateSecretKey, useTestCredentials } from '../hooks/useApiKeys'
import { maskSecret } from '../maskSecret'

const ROTATE_LABELS = {
  idle: 'Rotacionar',
  pending: 'Rotacionando…',
  success: 'Rotacionada',
  error: 'Falhou',
} as const

export function TestKeysCard() {
  const { data, isPending, isError, refetch } = useTestCredentials()
  const rotate = useRotateSecretKey()
  const [isSecretVisible, setIsSecretVisible] = useState(false)

  const badge = <StatusBadge tone="confirmed">Testnet</StatusBadge>

  if (isPending)
    return (
      <Card title="Ambiente de testes" action={badge}>
        <Skeleton lines={5} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Ambiente de testes" action={badge}>
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  const secretDisplay = isSecretVisible
    ? data.secretKey
    : maskSecret(data.secretKey)
  const revealLabel = isSecretVisible ? 'Ocultar' : 'Revelar'

  return (
    <Card title="Ambiente de testes" action={badge}>
      <div className="flex flex-col gap-1.5">
        <p className="text-muted text-xs">Chave publicável</p>
        <CopyField value={data.publishableKey} label="Chave publicável" />
        <p className="text-dim text-[11px]">
          Pode ficar exposta no front-end do checkout.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-muted text-xs">Chave secreta</p>
        <CopyField
          value={data.secretKey}
          displayValue={secretDisplay}
          label="Chave secreta"
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSecretVisible(!isSecretVisible)}
          >
            {revealLabel}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => rotate.mutate()}
            disabled={rotate.isPending}
          >
            <span aria-live="polite">{ROTATE_LABELS[rotate.status]}</span>
          </Button>
        </div>
        <p className="text-dim text-[11px]">
          Nunca use no navegador. Só em servidor.
        </p>
      </div>
    </Card>
  )
}
