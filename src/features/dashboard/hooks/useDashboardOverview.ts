import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDashboardOverview } from '../services/dashboard.service'
import type { DashboardRange } from '../types'

const LIVE_REFRESH_MS = 15_000

export function useDashboardOverview(range: DashboardRange) {
  return useQuery({
    queryKey: ['dashboard', range],
    queryFn: () => getDashboardOverview(range),
    placeholderData: keepPreviousData,
    // Keeps the balance and the event feed moving while the page is open.
    refetchInterval: LIVE_REFRESH_MS,
  })
}
