import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRequestStats, listRequestLogs } from '../services/logs.service'
import type { RequestLogParams } from '../types'

export function useRequestLogs(params: RequestLogParams) {
  return useQuery({
    queryKey: ['logs', 'requests', params],
    queryFn: () => listRequestLogs(params),
    placeholderData: keepPreviousData,
  })
}

export function useRequestStats() {
  return useQuery({ queryKey: ['logs', 'stats'], queryFn: getRequestStats })
}
