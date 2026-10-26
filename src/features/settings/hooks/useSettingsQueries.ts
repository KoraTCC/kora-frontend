import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addWallet,
  closeAccount,
  endOtherSessions,
  endSession,
  getBillingInsights,
  getBillingSettings,
  getSecuritySettings,
  inviteTeamMember,
  listAccessLog,
  listSessions,
  listTeamActivity,
  listTeamMembers,
  removeTeamMember,
  removeWallet,
} from '../services/settings.service'

export function useBillingSettings() {
  return useQuery({
    queryKey: ['settings', 'billing'],
    queryFn: getBillingSettings,
  })
}

export function useBillingInsights() {
  return useQuery({
    queryKey: ['settings', 'billing', 'insights'],
    queryFn: getBillingInsights,
  })
}

export function useTeamMembers() {
  return useQuery({ queryKey: ['team', 'members'], queryFn: listTeamMembers })
}

export function useTeamActivity() {
  return useQuery({ queryKey: ['team', 'activity'], queryFn: listTeamActivity })
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }),
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }),
  })
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['settings', 'security'],
    queryFn: getSecuritySettings,
  })
}

export function useSessions() {
  return useQuery({ queryKey: ['sessions'], queryFn: listSessions })
}

export function useEndSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: endSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  })
}

export function useEndOtherSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: endOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  })
}

export function useAccessLog() {
  return useQuery({
    queryKey: ['security', 'access-log'],
    queryFn: listAccessLog,
  })
}

export function useCloseAccount() {
  return useMutation({ mutationFn: closeAccount })
}

export function useAddWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  })
}

export function useRemoveWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  })
}
