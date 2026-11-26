import { Link } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { Input } from '#/components/ui/Input'
import type { ForgotPasswordFieldErrors } from '../types'
import { FormError } from '#/components/ui/FormError'

type ForgotPasswordFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  fieldErrors?: ForgotPasswordFieldErrors
  formError?: string
}

export function ForgotPasswordForm({
  onSubmit,
  isSubmitting,
  fieldErrors = {},
  formError,
}: ForgotPasswordFormProps) {
  const submitLabel = isSubmitting ? 'Enviando…' : 'Enviar link de recuperação'

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[22px]" noValidate>
      <Input
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="nome@empresa.com"
        required
        error={fieldErrors.email}
      />

      <FormError message={formError} />

      <Button type="submit" isBlock disabled={isSubmitting}>
        {submitLabel}
      </Button>

      <p className="text-muted text-center text-[13px]">
        Lembrou a senha?{' '}
        <Link to="/auth" className="text-lime font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
