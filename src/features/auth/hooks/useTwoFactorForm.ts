import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCountdown } from '#/hooks/useCountdown'
import { getFormError } from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { twoFactorSchema } from '../schemas'
import {
  resendTwoFactorCode,
  verifyTwoFactor,
} from '../services/account.service'

const RESEND_COOLDOWN_SECONDS = 30
const TWO_FACTOR_FIELDS = ['code'] as const

export function useTwoFactorForm() {
  const navigate = useNavigate()
  const verifyMutation = useMutation({ mutationFn: verifyTwoFactor })
  const resendMutation = useMutation({ mutationFn: resendTwoFactorCode })
  const countdown = useCountdown(RESEND_COOLDOWN_SECONDS)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()

  function handleCodeChange(nextCode: string) {
    setCode(nextCode)
    setCodeError(undefined)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = twoFactorSchema.safeParse({ code })

    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message)
      return
    }

    verifyMutation.mutate(parsed.data, {
      onSuccess: () => navigate({ to: '/' }),
      onError: (error) => {
        if (!(error instanceof ApiError)) return
        setCodeError(
          error.issues.find((issue) => issue.path === 'code')?.message,
        )
        setCode('')
      },
    })
  }

  function handleResend() {
    resendMutation.mutate(undefined, { onSuccess: countdown.restart })
  }

  return {
    code,
    codeError,
    handleCodeChange,
    handleSubmit,
    formError: getFormError(verifyMutation.error, TWO_FACTOR_FIELDS),
    isSubmitting: verifyMutation.isPending,
    resendSecondsLeft: countdown.secondsLeft,
    handleResend,
    isResending: resendMutation.isPending,
  }
}
