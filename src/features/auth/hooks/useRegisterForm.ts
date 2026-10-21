import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
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
      setFieldErrors(
        toFieldErrors(
          parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        ),
      )
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
            setFieldErrors(toFieldErrors(error.issues))
        },
      },
    )
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error),
    isSubmitting: mutation.isPending,
  }
}

function toFieldErrors(
  issues: ReadonlyArray<{ path: string; message: string }>,
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {}
  for (const { path, message } of issues) {
    if (!isRegisterField(path) || errors[path]) continue
    errors[path] = message
  }
  return errors
}

function isRegisterField(path: string): path is RegisterField {
  return (REGISTER_FIELDS as ReadonlyArray<string>).includes(path)
}

/** Erros de campo já aparecem no próprio campo; aqui só o que sobra. */
function getFormError(error: Error | null): string | undefined {
  if (!error) return undefined
  if (!(error instanceof ApiError)) return 'Algo deu errado. Tente novamente.'
  if (error.issues.some((issue) => isRegisterField(issue.path)))
    return undefined
  return error.message
}
