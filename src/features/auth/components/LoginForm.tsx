import { Link } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Checkbox } from '#/components/ui/Checkbox'
import { Divider } from '#/components/ui/Divider'
import { Input } from '#/components/ui/Input'
import { PasswordInput } from '#/components/ui/PasswordInput'
import type { LoginFieldErrors } from '../types'

type LoginFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  fieldErrors?: LoginFieldErrors
  formError?: string
  onSignupClick?: () => void
}

export function LoginForm({
  onSubmit,
  isSubmitting,
  fieldErrors = {},
  formError,
  onSignupClick,
}: LoginFormProps) {
  const submitLabel = isSubmitting ? 'Entrando…' : 'Entrar'

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

      <PasswordInput
        label="Senha"
        name="password"
        autoComplete="current-password"
        required
        error={fieldErrors.password}
        labelAction={
          <Link
            to="/forgot-password"
            className="text-lime text-xs hover:underline"
          >
            Esqueci a senha
          </Link>
        }
      />

      <Checkbox label="Manter sessão" name="remember" defaultChecked />

      {formError ? (
        <p role="alert" className="text-danger text-center text-[13px]">
          {formError}
        </p>
      ) : null}

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>

      <Divider>ou</Divider>

      <p className="text-muted text-center text-[13px]">
        Não tem conta? {' '}
        <Link
          to="/register"
          className="text-lime font-semibold hover:underline"
          onClick={onSignupClick}
        >
          Criar conta
        </Link>
      </p>
    </form>
  )
}
