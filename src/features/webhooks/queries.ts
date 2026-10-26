import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import {
  getLatestFailure,
  getWebhookSecret,
  getWebhookStats,
  getWebhookSubscription,
  listDeliveries,
  listRecentDeliveries,
  listWebhookEndpoints,
} from './services/webhooks.service'
import type { DeliveryListParams } from './types'

const LIVE_REFRESH_MS = 10_000

export const webhookEndpointsQueryOptions = queryOptions({
  queryKey: ['webhooks', 'endpoints'],
  queryFn: listWebhookEndpoints,
})

export const webhookStatsQueryOptions = queryOptions({
  queryKey: ['webhooks', 'stats'],
  queryFn: getWebhookStats,
})

/** "Ao vivo": the recent attempts refresh on their own. */
export const recentDeliveriesQueryOptions = queryOptions({
  queryKey: ['webhooks', 'deliveries', 'recent'],
  queryFn: listRecentDeliveries,
  refetchInterval: LIVE_REFRESH_MS,
})

export function deliveriesQueryOptions(params: DeliveryListParams) {
  return queryOptions({
    queryKey: ['webhooks', 'deliveries', params],
    queryFn: () => listDeliveries(params),
    placeholderData: keepPreviousData,
  })
}

export const latestFailureQueryOptions = queryOptions({
  queryKey: ['webhooks', 'deliveries', 'latest-failure'],
  queryFn: getLatestFailure,
})

export const webhookSubscriptionQueryOptions = queryOptions({
  queryKey: ['webhooks', 'subscription'],
  queryFn: getWebhookSubscription,
})

export const webhookSecretQueryOptions = queryOptions({
  queryKey: ['webhooks', 'secret'],
  queryFn: getWebhookSecret,
})
