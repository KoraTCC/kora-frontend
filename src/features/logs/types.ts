import type { z } from 'zod'
import type {
  httpMethodSchema,
  logsSearchSchema,
  requestLogPageSchema,
  requestLogSchema,
  requestStatsSchema,
  statusClassSchema,
} from './schemas'

export type StatusClass = z.infer<typeof statusClassSchema>
export type HttpMethod = z.infer<typeof httpMethodSchema>
export type RequestLog = z.infer<typeof requestLogSchema>
export type RequestLogPage = z.infer<typeof requestLogPageSchema>
export type RequestStats = z.infer<typeof requestStatsSchema>
export type LogsSearch = z.infer<typeof logsSearchSchema>

export type RequestLogParams = {
  statusClass?: StatusClass
  method?: HttpMethod
  q?: string
  page: number
  pageSize: number
}
