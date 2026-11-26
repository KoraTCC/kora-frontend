import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getFormError } from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { AUTH_USER_QUERY_KEY } from '../queries'
import { recoveryCodeSchema, twoFactorSchema } from '../schemas'
import { verifyTwoFactor } from '../services/account.service'

const TWO_FACTOR_FIELDS = ['code'] as const

/** `app`: the 6 digits from the authenticator; `recovery`: a backup code. */
export type TwoFactorMode = 'app' | 'recovery'

export function useTwoFactorForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const verifyMutation = useMutation({ mutationFn: verifyTwoFactor })
  const [mode, setMode] = useState<TwoFactorMode>('app')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()

  function handleCodeChange(nextCode: string) {
    setCode(nextCode)
    setCodeError(undefined)
  }

  function toggleMode() {
    setMode((current) => (current === 'app' ? 'recovery' : 'app'))
    setCode('')
    setCodeError(undefined)
    verifyMutation.reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const schema = mode === 'app' ? twoFactorSchema : recoveryCodeSchema
    const parsed = schema.safeParse({ code })

    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message)
      return
    }

    verifyMutation.mutate(parsed.data, {
      onSuccess: async () => {
        // The session only exists now: load the user before entering the app.
        await queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY })
        await navigate({ to: '/' })
      },
      onError: (error) => {
        if (!(error instanceof ApiError)) return
        setCodeError(
          error.issues.find((issue) => issue.path === 'code')?.message,
        )
        setCode('')
      },
    })
  }

  return {
    mode,
    toggleMode,
    code,
    codeError,
    handleCodeChange,
    handleSubmit,
    formError: getFormError(verifyMutation.error, TWO_FACTOR_FIELDS),
    isSubmitting: verifyMutation.isPending,
  }
}
