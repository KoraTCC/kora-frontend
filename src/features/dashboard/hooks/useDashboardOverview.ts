import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDashboardOverview } from '../services/dashboard.service'
import type { DashboardRange } from '../types'

export function useDashboardOverview(range: DashboardRange) {
  return useQuery({
    queryKey: ['dashboard', range],
    queryFn: () => getDashboardOverview(range),
    placeholderData: keepPreviousData,
  })
}
