import { Card } from '#/components/ui/Card'
import { formatTime } from '#/lib/date'
import type { AuditEntry } from '../types'
import { ViewAllLink } from './ViewAllLink'

export function RecentAuditCard({
  entries,
}: {
  entries: ReadonlyArray<AuditEntry>
}) {
  return (
    <Card
      title="Auditoria recente"
      action={<ViewAllLink to="/admin/audit" label="Ver tudo" />}
    >
      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-col gap-0.5">
            <p className="text-ink text-[13px]">{entry.action}</p>
            <p className="text-dim font-mono text-[10px]">
              {formatTime(entry.at)} · {entry.actor} · {entry.target}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
