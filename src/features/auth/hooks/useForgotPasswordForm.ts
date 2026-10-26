import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
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

export function useForgotPasswordForm() {
  const mutation = useMutation({ mutationFn: requestPasswordReset })
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({})

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
      onError: (error) => {
        if (error instanceof ApiError)
          setFieldErrors(toFieldErrors(error.issues, FORGOT_PASSWORD_FIELDS))
      },
    })
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error, FORGOT_PASSWORD_FIELDS),
    isSubmitting: mutation.isPending,
    isSent: mutation.isSuccess,
  }
}
