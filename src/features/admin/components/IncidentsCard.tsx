import { Card } from '#/components/ui/Card'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { formatTime } from '#/lib/date'
import { INCIDENT_STATE_META } from '../adminStatus'
import type { Incident } from '../types'

type IncidentsCardProps = {
  incidents: ReadonlyArray<Incident>
  title?: string
}

export function IncidentsCard({
  incidents,
  title = 'Incidentes abertos',
}: IncidentsCardProps) {
  const count = (
    <span className="text-status-failed font-mono text-[10px]">
      {incidents.length} abertos
    </span>
  )

  if (!incidents.length) {
    return (
      <Card title={title}>
        <p className="text-muted text-xs">Nenhum incidente aberto.</p>
      </Card>
    )
  }

  return (
    <Card title={title} action={count}>
      <ul className="flex flex-col gap-3.5">
        {incidents.map((incident) => (
          <li key={incident.id} className="flex flex-col gap-1">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-ink text-[13px]">{incident.title}</span>
              <StatusBadge tone={INCIDENT_STATE_META[incident.state].tone}>
                {INCIDENT_STATE_META[incident.state].label}
              </StatusBadge>
            </p>
            <p className="text-dim font-mono text-[10px]">
              {formatTime(incident.at)} · {incident.reference}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
