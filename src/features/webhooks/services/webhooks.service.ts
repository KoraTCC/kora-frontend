import { mockRequest } from '#/lib/mock'
import {
  WEBHOOK_EVENTS,
  acknowledgementSchema,
  deliveryFailureSchema,
  deliveryPageSchema,
  webhookDeliverySchema,
  webhookEndpointSchema,
  webhookSecretSchema,
  webhookStatsSchema,
  webhookSubscriptionSchema,
} from '../schemas'
import type {
  DeliveryFailure,
  DeliveryListParams,
  DeliveryPage,
  DeliveryResult,
  WebhookDelivery,
  WebhookEndpoint,
  WebhookSecret,
  WebhookStats,
  WebhookSubscription,
} from '../types'
import { DELIVERIES_FIXTURE, ENDPOINTS_FIXTURE } from './webhooks.fixtures'

// TODO(api): kora-backend has no webhook endpoints yet; see src/lib/mock.ts.

type Ok = { ok: true }

export function listWebhookEndpoints(): Promise<Array<WebhookEndpoint>> {
  return mockRequest('/webhooks/endpoints', {
    schema: webhookEndpointSchema.array(),
    response: ENDPOINTS_FIXTURE,
  })
}

export function getWebhookStats(): Promise<WebhookStats> {
  return mockRequest('/webhooks/stats', {
    schema: webhookStatsSchema,
    response: {
      delivered: 1284,
      successRate: 0.987,
      successTarget: 0.99,
      failing: 17,
      retryingEndpoints: 1,
      averageLatencyMs: 142,
      p95LatencyMs: 410,
    },
  })
}

export function listRecentDeliveries(): Promise<Array<WebhookDelivery>> {
  return mockRequest('/webhooks/deliveries?limit=6', {
    schema: webhookDeliverySchema.array(),
    response: DELIVERIES_FIXTURE.slice(0, 6),
  })
}

export function listDeliveries(
  params: DeliveryListParams,
): Promise<DeliveryPage> {
  const matching = DELIVERIES_FIXTURE.filter(
    (delivery) => !params.result || delivery.result === params.result,
  )
  const start = (params.page - 1) * params.pageSize

  return mockRequest('/webhooks/deliveries', {
    schema: deliveryPageSchema,
    response: {
      items: matching.slice(start, start + params.pageSize),
      page: params.page,
      pageSize: params.pageSize,
      total: matching.length,
      counts: countByResult(DELIVERIES_FIXTURE),
    },
  })
}

export function getLatestFailure(): Promise<DeliveryFailure> {
  const delivery = DELIVERIES_FIXTURE.find((item) => item.result !== 'success')
  return mockRequest('/webhooks/deliveries/latest-failure', {
    schema: deliveryFailureSchema,
    response: {
      delivery,
      endpointHost: 'staging.lojaexemplo.com',
      request: [
        'POST /kora/hooks HTTP/1.1',
        'Kora-Signature: t=1756392483,v1=9f21ba4c0e77…',
        'Content-Type: application/json',
        '',
        '{ "event": "charge.confirmed", "charge_id": "ch_18ea6d" }',
      ].join('\n'),
      responseLine: '← HTTP 502 Bad Gateway · 30.0 s · tentativa 3 de 5',
      responseStatus: '502 Bad Gateway',
      timeToError: '30,0 s · timeout',
      nextRetryAt: ENDPOINTS_FIXTURE[1].nextRetryAt,
      isSignatureValid: true,
    },
  })
}

export function getWebhookSubscription(): Promise<WebhookSubscription> {
  return mockRequest('/webhooks/subscription', {
    schema: webhookSubscriptionSchema,
    response: WEBHOOK_EVENTS.map((event) => ({
      event,
      isEnabled: event !== 'charge.failed',
    })),
  })
}

export function getWebhookSecret(): Promise<WebhookSecret> {
  return mockRequest('/webhooks/secret', {
    schema: webhookSecretSchema,
    response: {
      secret: 'whsec_3c8d1e5a7f9b2d4c6e8a0b1c3f8a',
      algorithm: 'HMAC-SHA256',
    },
  })
}

export function retryDelivery(deliveryId: string): Promise<Ok> {
  return mockRequest(`/webhooks/deliveries/${deliveryId}/retry`, {
    method: 'POST',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function sendTestWebhook(): Promise<Ok> {
  return mockRequest('/webhooks/test', {
    method: 'POST',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

function countByResult(
  deliveries: ReadonlyArray<WebhookDelivery>,
): Record<'all' | DeliveryResult, number> {
  const counts = { all: deliveries.length, success: 0, failed: 0, retrying: 0 }
  for (const delivery of deliveries) counts[delivery.result] += 1
  return counts
}

export function createWebhookEndpoint(input: { url: string }): Promise<Ok> {
  return mockRequest('/webhooks/endpoints', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}
