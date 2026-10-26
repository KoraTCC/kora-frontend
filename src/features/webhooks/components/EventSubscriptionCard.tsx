import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { Switch } from '#/components/ui/Switch'
import { useWebhookSubscription } from '../hooks/useWebhooks'

export function EventSubscriptionCard() {
  const { data, isPending, isError, refetch } = useWebhookSubscription()

  return (
    <Card title="Eventos assinados">
      <p className="text-dim -mt-2 text-[11px]">
        Escolha o que a Kora deve notificar para esta loja.
      </p>
      <EventSubscriptionBody
        subscription={data}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </Card>
  )
}

type EventSubscriptionBodyProps = {
  subscription?: ReturnType<typeof useWebhookSubscription>['data']
  isPending: boolean
  isError: boolean
  onRetry: () => void
}

function EventSubscriptionBody({
  subscription,
  isPending,
  isError,
  onRetry,
}: EventSubscriptionBodyProps) {
  if (isPending) return <Skeleton lines={6} />
  if (isError || !subscription) return <ErrorState onRetry={onRetry} />

  return (
    <div className="flex flex-col gap-2">
      {subscription.map((item) => (
        <Switch
          key={item.event}
          layout="boxed"
          label={item.event}
          defaultChecked={item.isEnabled}
        />
      ))}
    </div>
  )
}
