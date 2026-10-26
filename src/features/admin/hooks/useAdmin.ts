import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getMonitoring,
  getOverview,
  inviteMerchant,
  listAdminMerchants,
  listAudit,
  listGlobalCharges,
  restartService,
  suspendMerchants,
} from '../services/admin.service'
import type {
  AdminRange,
  AuditSearch,
  GlobalChargesSearch,
  MerchantsSearch,
} from '../types'

const LIVE_REFRESH_MS = 15_000

export function useOverview(range: AdminRange) {
  return useQuery({
    queryKey: ['admin', 'overview', range],
    queryFn: () => getOverview(range),
    placeholderData: keepPreviousData,
  })
}

export function useAdminMerchants(search: MerchantsSearch, pageSize: number) {
  return useQuery({
    queryKey: ['admin', 'merchants', search, pageSize],
    queryFn: () => listAdminMerchants(search, pageSize),
    placeholderData: keepPreviousData,
  })
}

export function useSuspendMerchants() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: suspendMerchants,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'merchants'] }),
  })
}

export function useInviteMerchant() {
  return useMutation({ mutationFn: inviteMerchant })
}

export function useGlobalCharges(
  search: GlobalChargesSearch,
  pageSize: number,
) {
  return useQuery({
    queryKey: ['admin', 'charges', search, pageSize],
    queryFn: () => listGlobalCharges(search, pageSize),
    placeholderData: keepPreviousData,
    refetchInterval: LIVE_REFRESH_MS,
  })
}

export function useMonitoring() {
  return useQuery({
    queryKey: ['admin', 'monitoring'],
    queryFn: getMonitoring,
    refetchInterval: LIVE_REFRESH_MS,
  })
}

export function useRestartService() {
  return useMutation({ mutationFn: restartService })
}

export function useAudit(search: AuditSearch, pageSize: number) {
  return useQuery({
    queryKey: ['admin', 'audit', search, pageSize],
    queryFn: () => listAudit(search, pageSize),
    placeholderData: keepPreviousData,
  })
}
