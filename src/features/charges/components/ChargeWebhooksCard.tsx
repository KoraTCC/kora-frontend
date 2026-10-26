import { Link } from '@tanstack/react-router'
import { Card } from '#/components/ui/Card'
import { cn } from '#/lib/cn'
import type { ChargeDetail } from '../types'

type ChargeWebhooksCardProps = {
  attempts: ChargeDetail['webhookAttempts']
}

export function ChargeWebhooksCard({ attempts }: ChargeWebhooksCardProps) {
  return (
    <Card
      title="Entregas de webhook"
      action={
        <Link to="/webhooks/logs" className="text-lime font-mono text-[10px]">
          Ver todas ↗
        </Link>
      }
    >
      <ul className="flex flex-col gap-2.5">
        {attempts.map((attempt) => (
          <li
            key={attempt.id}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="text-muted">{attempt.event}</span>
            <span
              className={cn(
                'font-mono',
                attempt.statusCode < 300 ? 'text-lime' : 'text-status-failed',
              )}
            >
              {attempt.statusCode} · {attempt.latencyMs} ms
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
