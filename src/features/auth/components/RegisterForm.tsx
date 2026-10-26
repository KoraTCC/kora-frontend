import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Checkbox } from '#/components/ui/Checkbox'
import { Input } from '#/components/ui/Input'
import { PasswordInput } from '#/components/ui/PasswordInput'
import type { RegisterFieldErrors } from '../types'
import { FormError } from '#/components/ui/FormError'
import { PasswordStrength } from './PasswordStrength'

type RegisterFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  fieldErrors?: RegisterFieldErrors
  formError?: string
}

export function RegisterForm({
  onSubmit,
  isSubmitting,
  fieldErrors = {},
  formError,
}: RegisterFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword
  const confirmPasswordError = passwordsMismatch
    ? 'As senhas não coincidem'
    : fieldErrors.confirmPassword
  const submitLabel = isSubmitting ? 'Criando conta…' : 'Criar conta'

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[22px]" noValidate>
      <Input
        label="Nome"
        name="name"
        autoComplete="name"
        placeholder="Seu nome completo"
        required
        error={fieldErrors.name}
      />
      {/* TODO: a API ainda não recebe o nome da loja; o campo não é enviado. */}
      <Input
        label="Nome da Loja"
        name="storeName"
        placeholder="Nome da sua loja"
      />
      <Input
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="contato@lojaexemplo.com"
        required
        error={fieldErrors.email}
      />

      <div className="flex flex-col gap-2">
        <PasswordInput
          label="Senha"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <PasswordStrength password={password} />
      </div>

      <PasswordInput
        label="Confirmar Senha"
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPasswordError}
      />

      <Checkbox
        label="Li e aceito os Termos de Uso e Política de Privacidade."
        name="acceptTerms"
        required
        error={fieldErrors.acceptTerms}
      />

      <FormError message={formError} />

      <Button
        type="submit"
        isBlock
        disabled={isSubmitting || passwordsMismatch}
      >
        {submitLabel}
      </Button>

      <p className="text-muted text-center text-[13px]">
        Já tem conta?{' '}
        <Link to="/auth" className="text-lime font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
