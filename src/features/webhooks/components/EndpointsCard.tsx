import { Link } from '@tanstack/react-router'
import { Button, buttonClasses } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import type { StatusTone } from '#/components/ui/StatusBadge'
import { formatTime } from '#/lib/date'
import { formatCountdown } from '#/lib/time'
import { useWebhookEndpoints } from '../hooks/useWebhooks'
import type { WebhookEndpoint } from '../types'

const STATUS_META: Record<
  WebhookEndpoint['status'],
  { label: string; tone: StatusTone }
> = {
  active: { label: 'Ativo', tone: 'confirmed' },
  failing: { label: 'Falhando', tone: 'failed' },
  paused: { label: 'Pausado', tone: 'expired' },
}

export function EndpointsCard() {
  const { data: endpoints, isPending, isError, refetch } = useWebhookEndpoints()
  const activeCount =
    endpoints?.filter((endpoint) => endpoint.status !== 'paused').length ?? 0

  return (
    <Card
      title="Endpoints"
      isFlush
      action={
        <span className="text-dim font-mono text-[10px]">
          {activeCount} ativos
        </span>
      }
    >
      <EndpointsBody
        endpoints={endpoints}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </Card>
  )
}

type EndpointsBodyProps = {
  endpoints?: ReadonlyArray<WebhookEndpoint>
  isPending: boolean
  isError: boolean
  onRetry: () => void
}

function EndpointsBody({
  endpoints,
  isPending,
  isError,
  onRetry,
}: EndpointsBodyProps) {
  if (isPending)
    return (
      <div className="p-4">
        <Skeleton lines={3} />
      </div>
    )
  if (isError || !endpoints)
    return (
      <div className="p-4">
        <ErrorState onRetry={onRetry} />
      </div>
    )
  if (!endpoints.length)
    return (
      <EmptyState
        title="Nenhum endpoint cadastrado"
        description="Cadastre a URL que vai receber os eventos das cobranças."
      />
    )

  return (
    <ul>
      {endpoints.map((endpoint) => (
        <li
          key={endpoint.id}
          className="border-line-soft flex flex-col gap-3 border-t px-4 py-3.5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:px-[18px]"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-ink truncate font-mono text-xs">
                {endpoint.url}
              </span>
              <StatusBadge tone={STATUS_META[endpoint.status].tone}>
                {STATUS_META[endpoint.status].label}
              </StatusBadge>
            </p>
            <p className="text-dim font-mono text-[10px]">
              {describeEndpoint(endpoint)}
            </p>
          </div>
          <EndpointActions endpoint={endpoint} />
        </li>
      ))}
    </ul>
  )
}

function EndpointActions({ endpoint }: { endpoint: WebhookEndpoint }) {
  if (endpoint.status === 'failing') {
    return (
      <div className="flex gap-2">
        <Link
          to="/webhooks/logs"
          search={{ result: 'retrying' }}
          className={buttonClasses({ variant: 'secondary', size: 'sm' })}
        >
          Tentar agora
        </Link>
        <Button variant="secondary" size="sm">
          Pausar
        </Button>
      </div>
    )
  }
  return (
    <div className="flex gap-2">
      <Link
        to="/webhooks/logs"
        className={buttonClasses({ variant: 'secondary', size: 'sm' })}
      >
        Logs
      </Link>
      <Button variant="secondary" size="sm">
        Editar
      </Button>
    </div>
  )
}

function describeEndpoint(endpoint: WebhookEndpoint): string {
  if (endpoint.status === 'failing') {
    const nextRetry = endpoint.nextRetryAt
      ? formatCountdown(
          (new Date(endpoint.nextRetryAt).getTime() - Date.now()) / 1000,
        )
      : '—'
    return `${endpoint.consecutiveFailures} falhas consecutivas · próxima tentativa em ${nextRetry}`
  }
  const lastDelivery = endpoint.lastDeliveryAt
    ? `última entrega ${formatTime(endpoint.lastDeliveryAt)}`
    : 'sem entregas'
  return `${endpoint.events.join(' · ')} · ${lastDelivery}`
}
