import { Link } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Input } from '#/components/ui/Input'

type ForgotPasswordFormProps = {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  error?: string  
  onSignupClick?: () => void
}

export function ForgotPasswordForm({ onSubmit, isSubmitting, error, onSignupClick }: ForgotPasswordFormProps) {
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

      <Button variant='primary' type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Enviar link'}
      </Button>

      <p className="text-muted text-center text-[13px]">
        Lembrou da senha? {' '}
        <Link
          to="/auth"
          className="text-lime font-semibold hover:underline"
          onClick={onSignupClick}
        >
          Entrar 
        </Link>
      </p>
    </form>
  )
}
