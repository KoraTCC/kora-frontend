import { mockRequest } from '#/lib/mock'
import { requestLogPageSchema, requestStatsSchema } from '../schemas'
import type {
  HttpMethod,
  RequestLog,
  RequestLogPage,
  RequestLogParams,
  RequestStats,
} from '../types'

// TODO(api): kora-backend has no request log endpoint yet; see src/lib/mock.ts.

const MINUTE_MS = 60_000

type LogSeed = [HttpMethod, string, number, number]

// [method, path, status, latency ms] — first rows match the Figma screen.
const SEEDS: Array<LogSeed> = [
  ['POST', '/v1/charges', 201, 84],
  ['GET', '/v1/charges/ch_8f21a4', 200, 31],
  ['POST', '/v1/charges', 201, 92],
  ['GET', '/v1/charges', 200, 48],
  ['POST', '/v1/charges', 422, 22],
  ['GET', '/v1/charges/ch_5ac733', 200, 29],
  ['POST', '/v1/webhooks/test', 200, 512],
  ['GET', '/v1/balances', 200, 37],
  ['POST', '/v1/charges', 401, 11],
  ['GET', '/v1/charges', 200, 52],
  ['DELETE', '/v1/webhooks/we_9', 500, 184],
]

const MINUTES_AGO = [2, 2, 6, 9, 14, 14, 22, 35, 48, 60]
const TOTAL_LOGS = 96

function buildLogs(now: number): Array<RequestLog> {
  return Array.from({ length: TOTAL_LOGS }, (_, index) => {
    const [method, path, statusCode, latencyMs] = SEEDS[index % SEEDS.length]
    const minutesAgo = MINUTES_AGO[index] ?? 60 + index * 9
    return {
      id: `req_${index + 1}`,
      method,
      path,
      statusCode,
      latencyMs,
      at: new Date(now - minutesAgo * MINUTE_MS).toISOString(),
    }
  })
}

export function listRequestLogs(
  params: RequestLogParams,
): Promise<RequestLogPage> {
  const matching = buildLogs(Date.now()).filter(
    (log) =>
      (!params.statusClass ||
        `${String(log.statusCode)[0]}xx` === params.statusClass) &&
      (!params.method || log.method === params.method) &&
      (!params.q || log.path.includes(params.q)),
  )
  const start = (params.page - 1) * params.pageSize

  return mockRequest('/logs/requests', {
    schema: requestLogPageSchema,
    response: {
      items: matching.slice(start, start + params.pageSize),
      page: params.page,
      pageSize: params.pageSize,
      total: matching.length,
    },
  })
}

export function getRequestStats(): Promise<RequestStats> {
  return mockRequest('/logs/requests/stats', {
    schema: requestStatsSchema,
    response: {
      requests: 3812,
      successRate: 0.964,
      successDelta: 0.008,
      clientErrors: 118,
      topClientError: '422 validação',
      p95LatencyMs: 184,
      averageLatencyMs: 52,
    },
  })
}
