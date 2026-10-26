import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { CopyField } from '#/components/ui/CopyField'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { maskSecret } from '#/features/api-keys/maskSecret'
import { useWebhookSecret } from '../hooks/useWebhooks'

export function SigningSecretCard() {
  const { data, isPending, isError, refetch } = useWebhookSecret()
  const algorithm = data ? (
    <span className="text-dim font-mono text-[10px]">{data.algorithm}</span>
  ) : null

  if (isPending)
    return (
      <Card title="Segredo de assinatura">
        <Skeleton lines={3} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Segredo de assinatura">
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  return (
    <Card title="Segredo de assinatura" action={algorithm}>
      <CopyField
        value={data.secret}
        displayValue={maskSecret(data.secret)}
        label="Segredo de assinatura"
      />
      <p className="text-dim text-[11px]">
        Use o segredo para validar o cabeçalho{' '}
        <code className="text-ink-soft font-mono">Kora-Signature</code> de cada
        entrega.
      </p>
      <Button variant="secondary" isBlock>
        Rotacionar segredo
      </Button>
    </Card>
  )
}
