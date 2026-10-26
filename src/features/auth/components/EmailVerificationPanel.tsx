import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import { StatusBadge } from '#/components/ui/StatusBadge'
import type { StatusTone } from '#/components/ui/StatusBadge'
import type { EmailVerificationState } from '../hooks/useEmailVerification'
import { AuthHeading } from './AuthHeading'
import { FormError } from '#/components/ui/FormError'
import { ResendHint } from './ResendHint'

type EmailVerificationPanelProps = {
  email?: string
  state: EmailVerificationState
  resendSecondsLeft: number
  canResend: boolean
  onResend: () => void
  isResending?: boolean
  hasResendError?: boolean
}

const STATE_BADGES: Record<
  EmailVerificationState,
  { tone: StatusTone; label: string; hint: string }
> = {
  checking: {
    tone: 'expired',
    label: 'Verificando',
    hint: 'Consultando o status da sua conta.',
  },
  pending: {
    tone: 'pending',
    label: 'Pendente',
    hint: 'Atualizamos esta tela automaticamente.',
  },
  error: {
    tone: 'failed',
    label: 'Sem conexão',
    hint: 'Não conseguimos consultar agora. Tentaremos de novo em instantes.',
  },
}

export function EmailVerificationPanel({
  email,
  state,
  resendSecondsLeft,
  canResend,
  onResend,
  isResending,
  hasResendError,
}: EmailVerificationPanelProps) {
  const badge = STATE_BADGES[state]
  const resendLabel = isResending ? 'Reenviando…' : 'Reenviar e-mail'
  const resendError = hasResendError
    ? 'Não foi possível reenviar. Tente novamente.'
    : undefined
  const recipient = email ? (
    <span className="text-ink font-mono text-[11px]">{email}</span>
  ) : (
    'o seu e-mail'
  )

  return (
    <div className="flex flex-col gap-[22px]">
      <span className="bg-lime-bg border-status-confirmed-border text-lime mx-auto flex size-16 items-center justify-center rounded-full border">
        <Mail size={26} aria-hidden />
      </span>

      <AuthHeading
        align="center"
        title="Verifique seu e-mail"
        description={
          <>
            Enviamos um link de confirmação para {recipient}. Abra o link para
            ativar a conta.
          </>
        }
      />

      <section
        aria-live="polite"
        className="bg-surface border-line flex flex-col gap-3 rounded-[14px] border p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-col gap-1">
          <p className="text-ink text-[13px] font-semibold">
            Aguardando confirmação
          </p>
          <p className="text-muted font-mono text-[10px] leading-relaxed">
            {badge.hint}
          </p>
        </div>
        <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
      </section>

      <ResendHint secondsLeft={resendSecondsLeft} />

      <FormError message={resendError} />

      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          isBlock
          onClick={onResend}
          disabled={!canResend}
        >
          {resendLabel}
        </Button>
        <Link
          to="/register"
          className="text-muted hover:text-ink flex min-h-11 items-center justify-center text-[13px]"
        >
          Usar outro e-mail
        </Link>
      </div>
    </div>
  )
}
