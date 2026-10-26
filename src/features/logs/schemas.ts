import { z } from 'zod'

export const STATUS_CLASSES = ['2xx', '4xx', '5xx'] as const
export const statusClassSchema = z.enum(STATUS_CLASSES)

export const HTTP_METHODS = ['GET', 'POST', 'PATCH', 'DELETE'] as const
export const httpMethodSchema = z.enum(HTTP_METHODS)

export const requestLogSchema = z.object({
  id: z.string(),
  method: httpMethodSchema,
  path: z.string(),
  statusCode: z.number(),
  latencyMs: z.number(),
  at: z.string(),
})

export const requestLogPageSchema = z.object({
  items: z.array(requestLogSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
})

export const requestStatsSchema = z.object({
  requests: z.number(),
  successRate: z.number(),
  successDelta: z.number(),
  clientErrors: z.number(),
  topClientError: z.string(),
  p95LatencyMs: z.number(),
  averageLatencyMs: z.number(),
})

export const logsSearchSchema = z.object({
  statusClass: statusClassSchema.optional().catch(undefined),
  method: httpMethodSchema.optional().catch(undefined),
  q: z.string().optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
})
