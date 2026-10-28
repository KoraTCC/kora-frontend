import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { CopyField } from '#/components/ui/CopyField'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Modal } from '#/components/ui/Modal'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { useRotateSecretKey, useTestCredentials } from '../hooks/useApiKeys'

export function TestKeysCard() {
  const { data, isPending, isError, refetch } = useTestCredentials()
  const rotate = useRotateSecretKey()

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

  const hasSecret = data.secretKey !== ''
  const rotateLabel = rotate.isPending
    ? 'Gerando…'
    : hasSecret
      ? 'Rotacionar'
      : 'Gerar chave secreta'

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
        <p className="border-line bg-surface text-ink rounded-[10px] border px-3.5 py-3 font-mono text-xs">
          {hasSecret ? data.secretKey : 'Nenhuma chave secreta ativa'}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => rotate.mutate()}
            disabled={rotate.isPending}
          >
            {rotateLabel}
          </Button>
        </div>
        <FormError message={rotate.error?.message} />
        <p className="text-dim text-[11px]">
          Por segurança, a chave secreta só aparece inteira quando é criada.
          Perdeu? Rotacione para gerar outra. Nunca use no navegador.
        </p>
      </div>
      <Modal
        open={rotate.isSuccess}
        onClose={() => rotate.reset()}
        title="Nova chave secreta"
        description="Copie agora: por segurança, ela não aparece inteira de novo. A anterior foi revogada."
        footer={
          <Button isBlock onClick={() => rotate.reset()}>
            Já copiei
          </Button>
        }
      >
        <CopyField
          value={rotate.data?.secretKey ?? ''}
          label="Nova chave secreta"
        />
        <Callout tone="warning">
          Guarde a chave só no servidor. Nunca no navegador.
        </Callout>
      </Modal>
    </Card>
  )
}
