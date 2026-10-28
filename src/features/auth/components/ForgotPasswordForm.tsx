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
  const notice =
    'Por segurança, respondemos igual para e-mails cadastrados ou não.'

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[22px]" noValidate>
      <Input
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="contato@lojaexemplo.com"
        required
        error={fieldErrors.email}
      />

      <FormError message={formError} />

      <Button type="submit" isBlock disabled={isSubmitting}>
        {submitLabel}
      </Button>

      <div aria-live="polite">
        <Callout>{notice}</Callout>
      </div>

      <p className="text-muted text-center text-[13px]">
        Lembrou a senha?{' '}
        <Link to="/auth" className="text-lime font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
