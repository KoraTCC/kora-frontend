import { Link } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Checkbox } from '#/components/ui/Checkbox'
import { Divider } from '#/components/ui/Divider'
import { Input } from '#/components/ui/Input'
import { PasswordInput } from '#/components/ui/PasswordInput'

type LoginFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  error?: string  
  onSignupClick?: () => void
}

export function LoginForm({ onSubmit, isSubmitting, error, onSignupClick }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[22px]" noValidate>
      <Input
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="contato@lojaexemplo.com"
        required
      />

      <PasswordInput
        label="Senha"
        name="password"
        autoComplete="current-password"
        required
        error={error}
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

      <Button variant='primary' type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando…' : 'Entrar'}
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
