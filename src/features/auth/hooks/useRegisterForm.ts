import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { registerFormSchema } from '../schemas'
import type { RegisterField, RegisterFieldErrors } from '../types'
import { useRegister } from './useRegister'

const REGISTER_FIELDS: ReadonlyArray<RegisterField> = [
  'name',
  'email',
  'password',
  'confirmPassword',
  'acceptTerms',
]

export function useRegisterForm() {
  const navigate = useNavigate()
  const mutation = useRegister()
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = registerFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      acceptTerms: formData.get('acceptTerms') === 'on',
    })

    if (!parsed.success) {
      const issues = zodIssuesToApiIssues(parsed.error.issues)
      setFieldErrors(toFieldErrors(issues, REGISTER_FIELDS))
      return
    }

    setFieldErrors({})
    const { name, email, password } = parsed.data
    mutation.mutate(
      { name, email, password },
      {
        onSuccess: () => navigate({ to: '/' }),
        onError: (error) => {
          if (error instanceof ApiError)
            setFieldErrors(toFieldErrors(error.issues, REGISTER_FIELDS))
        },
      },
    )
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error, REGISTER_FIELDS),
    isSubmitting: mutation.isPending,
  }
}
