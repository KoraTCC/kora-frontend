import type { z } from 'zod'
import type { dashboardOverviewSchema, dashboardRangeSchema } from './schemas'

export type DashboardRange = z.infer<typeof dashboardRangeSchema>
export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>
export type DashboardEvent = DashboardOverview['events'][number]
