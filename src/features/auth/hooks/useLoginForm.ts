import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { loginSchema } from '../schemas'
import type { LoginField, LoginFieldErrors } from '../types'
import { useLogin } from './useLogin'

const LOGIN_FIELDS: ReadonlyArray<LoginField> = ['email', 'password']

export function useLoginForm() {
  const navigate = useNavigate()
  const mutation = useLogin()
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!parsed.success) {
      const issues = zodIssuesToApiIssues(parsed.error.issues)
      setFieldErrors(toFieldErrors(issues, LOGIN_FIELDS))
      return
    }

    setFieldErrors({})
    mutation.mutate(parsed.data, {
      onSuccess: () => navigate({ to: '/' }),
      onError: (error) => {
        if (error instanceof ApiError)
          setFieldErrors(toFieldErrors(error.issues, LOGIN_FIELDS))
      },
    })
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error, LOGIN_FIELDS),
    isSubmitting: mutation.isPending,
  }
}
