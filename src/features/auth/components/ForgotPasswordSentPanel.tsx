import { Link } from '@tanstack/react-router'
import { MailCheck } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { AuthHeading } from './AuthHeading'
import { ResendHint } from './ResendHint'

type ForgotPasswordSentPanelProps = {
  email: string
  resendSecondsLeft: number
  canResend: boolean
  onResend: () => void
  onUseAnotherEmail: () => void
  isResending?: boolean
  resendError?: string
}

const TIPS = [
  'O link vale por 30 minutos e só pode ser usado uma vez.',
  'Não chegou? Confira a caixa de spam e as promoções.',
  'Se pedir de novo, só o link mais recente vai funcionar.',
]

/** Shown after the reset link is requested — same answer for any e-mail. */
export function ForgotPasswordSentPanel({
  email,
  resendSecondsLeft,
  canResend,
  onResend,
  onUseAnotherEmail,
  isResending,
  resendError,
}: ForgotPasswordSentPanelProps) {
  const resendLabel = isResending ? 'Reenviando…' : 'Reenviar link'

  return (
    <div className="flex flex-col gap-[22px]" role="status" aria-live="polite">
      <span className="bg-lime-bg border-status-confirmed-border text-lime mx-auto flex size-16 items-center justify-center rounded-full border">
        <MailCheck size={26} aria-hidden />
      </span>

      <AuthHeading
        align="center"
        title="Confira seu e-mail"
        description={
          <>
            Se houver uma conta com{' '}
            <span className="text-ink font-mono text-[11px]">{email}</span>,
            enviamos um link para você criar uma nova senha.
          </>
        }
      />

      <ul className="bg-surface border-line flex flex-col gap-2 rounded-[14px] border p-4">
        {TIPS.map((tip) => (
          <li
            key={tip}
            className="text-muted flex gap-2.5 text-xs leading-[1.5]"
          >
            <span
              aria-hidden
              className="bg-lime mt-1.5 size-1.5 flex-none rounded-full"
            />
            {tip}
          </li>
        ))}
      </ul>

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
        <button
          type="button"
          onClick={onUseAnotherEmail}
          className="text-muted hover:text-ink flex min-h-11 items-center justify-center text-[13px]"
        >
          Usar outro e-mail
        </button>
        <Link
          to="/auth"
          className="text-lime flex min-h-11 items-center justify-center text-[13px] font-semibold hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
