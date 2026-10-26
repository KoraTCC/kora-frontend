import type { ReactNode } from 'react'
import { formatCountdown } from '#/lib/time'

type ResendHintProps = {
  secondsLeft: number
  /** Shown once the cooldown is over. */
  action?: ReactNode
}

export function ResendHint({ secondsLeft, action }: ResendHintProps) {
  if (secondsLeft <= 0) return action

  return (
    <p role="timer" className="text-muted text-center text-[11px]">
      Não recebeu? Reenviar em{' '}
      <span className="text-status-pending ml-1 font-mono">
        {formatCountdown(secondsLeft)}
      </span>
    </p>
  )
}
