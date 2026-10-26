import { EndpointsCard } from './EndpointsCard'
import { EventSubscriptionCard } from './EventSubscriptionCard'
import { RecentDeliveriesCard } from './RecentDeliveriesCard'
import { SigningSecretCard } from './SigningSecretCard'
import { WebhookKpis } from './WebhookKpis'

export function WebhooksView() {
  return (
    <>
      <WebhookKpis />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex min-w-0 flex-col gap-4">
          <EndpointsCard />
          <RecentDeliveriesCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <EventSubscriptionCard />
          <SigningSecretCard />
        </div>
      </div>
    </>
  )
}
