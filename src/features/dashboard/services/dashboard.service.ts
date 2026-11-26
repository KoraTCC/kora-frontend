import { apiRequest } from '#/lib/http'
import { dashboardOverviewSchema } from '../schemas'
import type { DashboardOverview, DashboardRange } from '../types'

/** Painel calculado pela API a partir das cobranças da loja. */
export function getDashboardOverview(
  range: DashboardRange,
): Promise<DashboardOverview> {
  return apiRequest(`/dashboard?range=${range}`, {
    schema: dashboardOverviewSchema,
  })
}
