import { z } from 'zod'
import { networkSchema } from '#/features/networks/networks'

export const DASHBOARD_RANGES = ['24h', '7d', '30d'] as const
export const dashboardRangeSchema = z.enum(DASHBOARD_RANGES)

export const dashboardSearchSchema = z.object({
  range: dashboardRangeSchema.optional().catch(undefined),
})

export const dashboardOverviewSchema = z.object({
  volume: z.object({
    totalCents: z.number(),
    delta: z.number(),
    breakdown: z.string(),
    points: z.array(z.object({ label: z.string(), value: z.number() })),
  }),
  distribution: z.array(
    z.object({ network: networkSchema, share: z.number() }),
  ),
  integration: z.array(
    z.object({ id: z.string(), label: z.string(), isDone: z.boolean() }),
  ),
  events: z.array(
    z.object({
      id: z.string(),
      tone: z.enum(['confirmed', 'detected', 'failed', 'pending']),
      title: z.string(),
      detail: z.string(),
      at: z.string(),
    }),
  ),
})
