import { Link } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Checkbox } from '#/components/ui/Checkbox'
import { Input } from '#/components/ui/Input'
import { PasswordInput } from '#/components/ui/PasswordInput'
import { PasswordStrength } from './PasswordStrength';

type RegisterFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  error?: string  
  onSignupClick?: () => void
}

export function RegisterForm({ onSubmit, isSubmitting, error, onSignupClick }: RegisterFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

    return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[22px]" noValidate>
      <Input
        label="Nome"
        name="name"
        placeholder="Seu nome completo"
        required
      />
      <Input
        label="Nome da Loja"
        name="storeName"
        placeholder="Nome da sua loja"
        required
      />
      <Input
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="contato@lojaexemplo.com"
        required
      />

      <div className="flex flex-col gap-2">
        <PasswordInput
          label="Senha"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        error={passwordsMismatch ? 'As senhas não coincidem' : undefined}
      />

      <Checkbox 
      label="Li e aceito os Termos de Uso e Política de Privacidade." 
      name="acceptTerms"
      required
      />

     <Button variant="primary" type="submit" disabled={isSubmitting || passwordsMismatch}>
        {isSubmitting ? 'Criando conta…' : 'Criar conta'}
      </Button>

      <p className="text-muted text-center text-[13px]">
        Já tem conta? {' '}
        <Link
          to="/"
          className="text-lime font-semibold hover:underline"
          onClick={onSignupClick}
        >
          Entrar
        </Link>
      </p>
    </form>
  )
}
