import { Button } from '#/components/ui/Button'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { SERVICE_STATUS_META } from '../adminStatus'
import { useRestartService } from '../hooks/useAdmin'
import type { ServiceHealth } from '../types'

type ServiceHealthListProps = {
  services: ReadonlyArray<ServiceHealth>
  /** Offer "Reiniciar" on degraded services. */
  canRestart?: boolean
}

const RESTART_LABELS = {
  idle: 'Reiniciar',
  pending: 'Reiniciando…',
  success: 'Reiniciado',
  error: 'Falhou',
} as const

export function ServiceHealthList({
  services,
  canRestart = false,
}: ServiceHealthListProps) {
  const restart = useRestartService()
  const rows = services.map((service) => ({
    ...service,
    isRestartable: canRestart && service.status === 'degraded',
    meta: SERVICE_STATUS_META[service.status],
  }))

  return (
    <ul>
      {rows.map((service) => (
        <li
          key={service.id}
          className="border-line-soft flex items-center justify-between gap-3 border-t px-4 py-3 first:border-t-0 sm:px-[18px]"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-ink text-[13px]">{service.name}</p>
            <p className="text-dim truncate font-mono text-[10px]">
              {service.detail}
            </p>
          </div>
          <div className="flex flex-none items-center gap-2">
            {service.isRestartable ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => restart.mutate(service.id)}
                disabled={restart.isPending}
              >
                <span aria-live="polite">{RESTART_LABELS[restart.status]}</span>
              </Button>
            ) : null}
            <StatusBadge tone={service.meta.tone}>
              {service.meta.label}
            </StatusBadge>
          </div>
        </li>
      ))}
    </ul>
  )
}
