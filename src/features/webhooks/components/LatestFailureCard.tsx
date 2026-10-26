import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { CodeBlock } from '#/components/ui/CodeBlock'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { useCopyToClipboard } from '#/hooks/useCopyToClipboard'
import { formatCountdown } from '#/lib/time'
import { useLatestFailure, useRetryDelivery } from '../hooks/useWebhooks'

const RETRY_LABELS = {
  idle: 'Tentar agora',
  pending: 'Reenviando…',
  success: 'Reenviado',
  error: 'Falhou',
} as const

export function LatestFailureCard() {
  const { data, isPending, isError, refetch } = useLatestFailure()
  const retry = useRetryDelivery()
  const { state: copyState, copy } = useCopyToClipboard()

  if (isPending)
    return (
      <Card title="Última falha">
        <Skeleton lines={6} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Última falha">
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  const { delivery } = data
  const nextRetry = data.nextRetryAt
    ? `em ${formatCountdown((new Date(data.nextRetryAt).getTime() - Date.now()) / 1000)}`
    : '—'
  const copyLabel = copyState === 'copied' ? 'Copiado' : 'Copiar payload'

  return (
    <Card
      title={`Última falha · ${delivery.event} · ${delivery.chargeId}`}
      action={<StatusBadge tone="failed">Falhou</StatusBadge>}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_374px]">
        <CodeBlock
          code={`${data.request}\n\n${data.responseLine}`}
          label="Requisição enviada e resposta"
        />
        <div className="flex flex-col gap-4">
          <DescriptionList
            items={[
              { label: 'Endpoint', value: data.endpointHost },
              { label: 'Resposta', value: data.responseStatus, tone: 'danger' },
              { label: 'Tempo até o erro', value: data.timeToError },
              {
                label: 'Tentativa',
                value: `${delivery.attempt} de ${delivery.maxAttempts}`,
              },
              { label: 'Próxima tentativa', value: nextRetry, tone: 'warning' },
              {
                label: 'Assinatura',
                value: data.isSignatureValid ? 'válida' : 'inválida',
              },
            ]}
          />
          <Callout tone="danger">
            O endpoint não respondeu dentro de 30 s. Depois da 5ª tentativa o
            evento é descartado e o endpoint é pausado.
          </Callout>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => retry.mutate(delivery.id)}
              disabled={retry.isPending}
            >
              <span aria-live="polite">{RETRY_LABELS[retry.status]}</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void copy(data.request)}
            >
              <span aria-live="polite">{copyLabel}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
