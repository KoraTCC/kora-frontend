import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, buttonClasses } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { PasswordInput } from '#/components/ui/PasswordInput'
import type { ResetPasswordFieldErrors } from '../types'
import { FormError } from '#/components/ui/FormError'
import { PasswordStrength } from './PasswordStrength'

type ResetPasswordFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  fieldErrors?: ResetPasswordFieldErrors
  formError?: string
}

export function ResetPasswordForm({
  onSubmit,
  isSubmitting,
  fieldErrors = {},
  formError,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword
  const confirmPasswordError = passwordsMismatch
    ? 'As senhas não conferem'
    : fieldErrors.confirmPassword
  const submitLabel = isSubmitting ? 'Salvando…' : 'Salvar nova senha'

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[22px]" noValidate>
      <div className="flex flex-col gap-2">
        <PasswordInput
          label="Nova senha"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />
        <PasswordStrength password={password} />
      </div>

      <PasswordInput
        label="Confirmar nova senha"
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={confirmPasswordError}
      />

      <Callout tone="warning">
        Trocar a senha encerra todas as sessões ativas e mantém a verificação em
        duas etapas.
      </Callout>

      <FormError message={formError} />

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          isBlock
          disabled={isSubmitting || passwordsMismatch}
        >
          {submitLabel}
        </Button>
        <Link
          to="/auth"
          className={buttonClasses({ variant: 'ghost', isBlock: true })}
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
