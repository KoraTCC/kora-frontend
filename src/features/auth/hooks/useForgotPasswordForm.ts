import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCountdown } from '#/hooks/useCountdown'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { forgotPasswordSchema } from '../schemas'
import { requestPasswordReset } from '../services/account.service'
import type { ForgotPasswordField, ForgotPasswordFieldErrors } from '../types'

const FORGOT_PASSWORD_FIELDS: ReadonlyArray<ForgotPasswordField> = ['email']

/** Wait before asking for another link — the API also rate-limits. */
const RESEND_COOLDOWN_SECONDS = 60

export function useForgotPasswordForm() {
  const resendCooldown = useCountdown(RESEND_COOLDOWN_SECONDS)
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => resendCooldown.restart(),
  })
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({})
  // Kept apart from the mutation so a failed resend keeps the "sent" screen.
  const [sentTo, setSentTo] = useState<string>()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = forgotPasswordSchema.safeParse({
      email: formData.get('email'),
    })

    if (!parsed.success) {
      const issues = zodIssuesToApiIssues(parsed.error.issues)
      setFieldErrors(toFieldErrors(issues, FORGOT_PASSWORD_FIELDS))
      return
    }

    setFieldErrors({})
    mutation.mutate(parsed.data, {
      onSuccess: () => setSentTo(parsed.data.email),
      onError: (error) => {
        if (error instanceof ApiError)
          setFieldErrors(toFieldErrors(error.issues, FORGOT_PASSWORD_FIELDS))
      },
    })
  }

  function resend() {
    if (sentTo) mutation.mutate({ email: sentTo })
  }

  /** Back to the form, to type a different address. */
  function startOver() {
    mutation.reset()
    setSentTo(undefined)
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error, FORGOT_PASSWORD_FIELDS),
    isSubmitting: mutation.isPending,
    sentTo,
    resend,
    startOver,
    isResending: Boolean(sentTo) && mutation.isPending,
    resendError:
      sentTo && mutation.isError ? mutation.error.message : undefined,
    resendSecondsLeft: resendCooldown.secondsLeft,
    canResend: resendCooldown.isDone && !mutation.isPending,
  }
}
