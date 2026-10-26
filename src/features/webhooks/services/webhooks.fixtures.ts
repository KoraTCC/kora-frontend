import type {
  DeliveryResult,
  WebhookDelivery,
  WebhookEndpoint,
  WebhookEvent,
} from '../types'

const MINUTE_MS = 60_000
const now = Date.now()
const minutesAgo = (minutes: number) =>
  new Date(now - minutes * MINUTE_MS).toISOString()

export const ENDPOINTS_FIXTURE: Array<WebhookEndpoint> = [
  {
    id: 'we_1',
    url: 'https://lojaexemplo.com/kora/hooks',
    status: 'active',
    events: ['charge.confirmed', 'charge.expired', 'charge.partial'],
    lastDeliveryAt: minutesAgo(1),
    consecutiveFailures: 0,
    nextRetryAt: null,
  },
  {
    id: 'we_2',
    url: 'https://staging.lojaexemplo.com/hooks',
    status: 'failing',
    events: ['charge.confirmed'],
    lastDeliveryAt: minutesAgo(9),
    consecutiveFailures: 17,
    nextRetryAt: new Date(now + 4 * MINUTE_MS + 12_000).toISOString(),
  },
]

type DeliverySeed = [WebhookEvent, number, string, number, number]

// [event, status code, charge, latency ms, attempt] — first rows match Figma.
const SEEDS: Array<DeliverySeed> = [
  ['charge.confirmed', 200, 'ch_8f21a4', 142, 1],
  ['charge.detected', 200, 'ch_5ac733', 118, 1],
  ['charge.confirmed', 502, 'ch_18ea6d', 30_000, 3],
  ['charge.expired', 200, 'ch_9b1e57', 96, 1],
  ['charge.partial', 200, 'ch_2de480', 204, 1],
  ['charge.created', 200, 'ch_71bd09', 88, 1],
  ['charge.confirmed', 429, 'ch_44c0a2', 1_200, 2],
  ['charge.confirmed', 200, 'ch_c39f81', 133, 1],
  ['charge.detected', 200, 'ch_6b22af', 104, 1],
]

const TOTAL_DELIVERIES = 64

function toResult(statusCode: number, attempt: number): DeliveryResult {
  if (statusCode < 300) return 'success'
  return attempt < 5 ? 'retrying' : 'failed'
}

export const DELIVERIES_FIXTURE: Array<WebhookDelivery> = Array.from(
  { length: TOTAL_DELIVERIES },
  (_, index) => {
    const [event, statusCode, chargeId, latencyMs, attempt] =
      SEEDS[index % SEEDS.length]
    return {
      id: `whd_${index + 1}`,
      at: minutesAgo(index * 7 + 1),
      event,
      statusCode,
      chargeId,
      latencyMs,
      attempt,
      maxAttempts: 5,
      result:
        index > 40 && statusCode >= 300
          ? 'failed'
          : toResult(statusCode, attempt),
    }
  },
)
