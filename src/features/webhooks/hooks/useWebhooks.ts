import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deliveriesQueryOptions,
  latestFailureQueryOptions,
  recentDeliveriesQueryOptions,
  webhookEndpointsQueryOptions,
  webhookSecretQueryOptions,
  webhookStatsQueryOptions,
  webhookSubscriptionQueryOptions,
} from '../queries'
import {
  createWebhookEndpoint,
  retryDelivery,
  sendTestWebhook,
} from '../services/webhooks.service'
import type { DeliveryListParams } from '../types'

export function useWebhookEndpoints() {
  return useQuery(webhookEndpointsQueryOptions)
}

export function useWebhookStats() {
  return useQuery(webhookStatsQueryOptions)
}

export function useRecentDeliveries() {
  return useQuery(recentDeliveriesQueryOptions)
}

export function useDeliveries(params: DeliveryListParams) {
  return useQuery(deliveriesQueryOptions(params))
}

export function useLatestFailure() {
  return useQuery(latestFailureQueryOptions)
}

export function useWebhookSubscription() {
  return useQuery(webhookSubscriptionQueryOptions)
}

export function useWebhookSecret() {
  return useQuery(webhookSecretQueryOptions)
}

export function useRetryDelivery() {
  return useMutation({ mutationFn: retryDelivery })
}

export function useSendTestWebhook() {
  return useMutation({ mutationFn: sendTestWebhook })
}

export function useCreateWebhookEndpoint() {
  return useMutation({ mutationFn: createWebhookEndpoint })
}
