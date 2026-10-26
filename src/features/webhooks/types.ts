import type { z } from 'zod'
import type {
  deliveryFailureSchema,
  deliveryLogSearchSchema,
  deliveryPageSchema,
  deliveryResultSchema,
  webhookDeliverySchema,
  webhookEndpointSchema,
  webhookEventSchema,
  webhookSecretSchema,
  webhookStatsSchema,
  webhookSubscriptionSchema,
} from './schemas'

export type WebhookEvent = z.infer<typeof webhookEventSchema>
export type WebhookEndpoint = z.infer<typeof webhookEndpointSchema>
export type WebhookDelivery = z.infer<typeof webhookDeliverySchema>
export type DeliveryResult = z.infer<typeof deliveryResultSchema>
export type WebhookStats = z.infer<typeof webhookStatsSchema>
export type WebhookSubscription = z.infer<typeof webhookSubscriptionSchema>
export type WebhookSecret = z.infer<typeof webhookSecretSchema>
export type DeliveryPage = z.infer<typeof deliveryPageSchema>
export type DeliveryFailure = z.infer<typeof deliveryFailureSchema>
export type DeliveryLogSearch = z.infer<typeof deliveryLogSearchSchema>

export type DeliveryListParams = {
  result?: DeliveryResult
  page: number
  pageSize: number
}
