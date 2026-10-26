import { z } from 'zod'

export const WEBHOOK_EVENTS = [
  'charge.created',
  'charge.detected',
  'charge.confirmed',
  'charge.partial',
  'charge.expired',
  'charge.failed',
] as const
export const webhookEventSchema = z.enum(WEBHOOK_EVENTS)

export const webhookEndpointSchema = z.object({
  id: z.string(),
  url: z.string(),
  status: z.enum(['active', 'failing', 'paused']),
  events: z.array(webhookEventSchema),
  lastDeliveryAt: z.string().nullable(),
  consecutiveFailures: z.number(),
  nextRetryAt: z.string().nullable(),
})

export const DELIVERY_RESULTS = ['success', 'failed', 'retrying'] as const
export const deliveryResultSchema = z.enum(DELIVERY_RESULTS)

export const webhookDeliverySchema = z.object({
  id: z.string(),
  at: z.string(),
  event: webhookEventSchema,
  statusCode: z.number(),
  chargeId: z.string(),
  latencyMs: z.number(),
  attempt: z.number(),
  maxAttempts: z.number(),
  result: deliveryResultSchema,
})

export const webhookStatsSchema = z.object({
  delivered: z.number(),
  successRate: z.number(),
  successTarget: z.number(),
  failing: z.number(),
  retryingEndpoints: z.number(),
  averageLatencyMs: z.number(),
  p95LatencyMs: z.number(),
})

export const webhookSubscriptionSchema = z.array(
  z.object({ event: webhookEventSchema, isEnabled: z.boolean() }),
)

export const webhookSecretSchema = z.object({
  secret: z.string(),
  algorithm: z.string(),
})

export const deliveryPageSchema = z.object({
  items: z.array(webhookDeliverySchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  counts: z.record(z.enum(['all', ...DELIVERY_RESULTS]), z.number()),
})

export const deliveryFailureSchema = z.object({
  delivery: webhookDeliverySchema,
  endpointHost: z.string(),
  request: z.string(),
  responseLine: z.string(),
  responseStatus: z.string(),
  timeToError: z.string(),
  nextRetryAt: z.string().nullable(),
  isSignatureValid: z.boolean(),
})

export const deliveryLogSearchSchema = z.object({
  result: deliveryResultSchema.optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
})

export const acknowledgementSchema = z.object({ ok: z.literal(true) })

export const newEndpointFormSchema = z.object({
  url: z
    .url('Informe uma URL https válida')
    .startsWith('https://', 'Use https://'),
})
