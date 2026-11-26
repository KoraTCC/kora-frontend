import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import { useTurnstile } from '#/hooks/useTurnstile'
import { ApiError } from '#/lib/http'
import { loginSchema } from '../schemas'
import type { LoginField, LoginFieldErrors } from '../types'
import { useLogin } from './useLogin'

const LOGIN_FIELDS: ReadonlyArray<LoginField> = ['email', 'password']
const CAPTCHA_REQUIRED = 'Confirme que você não é um robô.'

export function useLoginForm() {
  const navigate = useNavigate()
  const mutation = useLogin()
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [captchaError, setCaptchaError] = useState<string>()
  const captcha = useTurnstile()

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
    const turnstileToken = captcha.getToken()
    if (captcha.isEnabled && !turnstileToken) {
      setCaptchaError(CAPTCHA_REQUIRED)
      return
    }

    setCaptchaError(undefined)
    mutation.mutate(
      { ...parsed.data, turnstileToken },
      {
        onSuccess: (response) =>
          'twoFactorRequired' in response
            ? navigate({ to: '/auth', search: { step: 'two-factor' } })
            : navigate({ to: '/' }),
        onError: (error) => {
          if (error instanceof ApiError)
            setFieldErrors(toFieldErrors(error.issues, LOGIN_FIELDS))
        },
        // Each token is single use, so every attempt needs a fresh challenge.
        onSettled: () => captcha.reset(),
      },
    )
  }

  return {
    handleSubmit,
    fieldErrors,
    formError: captchaError ?? getFormError(mutation.error, LOGIN_FIELDS),
    captcha,
    isSubmitting: mutation.isPending,
  }
}
