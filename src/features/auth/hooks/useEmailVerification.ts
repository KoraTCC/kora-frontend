import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCountdown } from '#/hooks/useCountdown'
import { emailVerificationQueryOptions } from '../queries'
import { resendVerificationEmail } from '../services/account.service'

const RESEND_COOLDOWN_SECONDS = 60

export type EmailVerificationState = 'checking' | 'pending' | 'error'

export function useEmailVerification(email: string) {
  const navigate = useNavigate()
  const hasEmail = email.length > 0
  const query = useQuery({
    ...emailVerificationQueryOptions(email),
    enabled: hasEmail,
  })
  const resendMutation = useMutation({ mutationFn: resendVerificationEmail })
  const countdown = useCountdown(RESEND_COOLDOWN_SECONDS)

  const isVerified = query.data?.status === 'verified'

  useEffect(() => {
    if (isVerified) void navigate({ to: '/', replace: true })
  }, [isVerified, navigate])

  function handleResend() {
    resendMutation.mutate(email, { onSuccess: countdown.restart })
  }

  return {
    state: toVerificationState(query.isLoading, query.isError),
    resendSecondsLeft: countdown.secondsLeft,
    canResend: hasEmail && countdown.isDone && !resendMutation.isPending,
    handleResend,
    isResending: resendMutation.isPending,
    hasResendError: resendMutation.isError,
  }
}

function toVerificationState(
  isLoading: boolean,
  isError: boolean,
): EmailVerificationState {
  if (isLoading) return 'checking'
  if (isError) return 'error'
  return 'pending'
}
