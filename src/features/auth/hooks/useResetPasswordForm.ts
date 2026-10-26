import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { resetPasswordFormSchema } from '../schemas'
import { resetPassword } from '../services/account.service'
import type { ResetPasswordField, ResetPasswordFieldErrors } from '../types'

const RESET_PASSWORD_FIELDS: ReadonlyArray<ResetPasswordField> = [
  'password',
  'confirmPassword',
]

export function useResetPasswordForm(token: string) {
  const navigate = useNavigate()
  const mutation = useMutation({ mutationFn: resetPassword })
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = resetPasswordFormSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    if (!parsed.success) {
      const issues = zodIssuesToApiIssues(parsed.error.issues)
      setFieldErrors(toFieldErrors(issues, RESET_PASSWORD_FIELDS))
      return
    }

    setFieldErrors({})
    mutation.mutate(
      { token, password: parsed.data.password },
      {
        onSuccess: () => navigate({ to: '/auth', replace: true }),
        onError: (error) => {
          if (error instanceof ApiError)
            setFieldErrors(toFieldErrors(error.issues, RESET_PASSWORD_FIELDS))
        },
      },
    )
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error, RESET_PASSWORD_FIELDS),
    isSubmitting: mutation.isPending,
  }
}
