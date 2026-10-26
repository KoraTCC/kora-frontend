import { Card } from '#/components/ui/Card'
import { CodeBlock } from '#/components/ui/CodeBlock'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ProgressBar } from '#/components/ui/ProgressBar'
import { formatDayTime } from '#/lib/date'
import type { AuditEntry, AuditPage } from '../types'

export function AuditDetailCard({ entry }: { entry: AuditEntry }) {
  return (
    <Card title="Detalhe do registro">
      <DescriptionList
        items={[
          { label: 'Ator', value: entry.actor },
          { label: 'Ação', value: entry.actionCode },
          { label: 'Alvo', value: entry.target },
          { label: 'Origem', value: entry.origin ?? '—' },
          { label: 'Quando', value: formatDayTime(entry.at) },
        ]}
      />
      <CodeBlock
        code={entry.payload}
        label={`Dados do registro ${entry.actionCode}`}
      />
    </Card>
  )
}

export function TopActionsCard({
  actions,
}: {
  actions: AuditPage['topActions']
}) {
  const max = Math.max(...actions.map((action) => action.count), 1)
  return (
    <Card title="Ações mais frequentes · 7 d">
      <ul className="flex flex-col gap-3">
        {actions.map((action) => (
          <li key={action.code} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-3 text-xs">
              <span className="text-ink">{action.code}</span>
              <span className="text-muted font-mono">{action.count}</span>
            </div>
            <ProgressBar
              value={action.count / max}
              label={action.code}
              tone={action.isCritical ? 'danger' : 'lime'}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}
