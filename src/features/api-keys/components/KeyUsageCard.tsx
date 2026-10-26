import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { ProgressBar } from '#/components/ui/ProgressBar'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatDate } from '#/lib/date'
import { formatNumber } from '#/lib/money'
import { useApiKeys } from '../hooks/useApiKeys'

export function KeyUsageCard() {
  const { data: keys, isPending, isError, refetch } = useApiKeys()
  const action = (
    <span className="text-dim font-mono text-[10px]">últimos 7 dias</span>
  )

  if (isPending)
    return (
      <Card title="Uso por chave" action={action}>
        <Skeleton lines={4} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Uso por chave" action={action}>
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  const maxCalls = Math.max(...keys.map((key) => key.callsLast7d), 1)
  const rows = [...keys]
    .sort((first, second) => second.callsLast7d - first.callsLast7d)
    .map((key) => ({
      ...key,
      share: key.callsLast7d / maxCalls,
      callsLabel: key.callsLast7d
        ? `${formatNumber(key.callsLast7d)} chamadas`
        : 'nenhuma',
    }))
  const unusedKey = keys.find((key) => !key.lastUsedAt)

  return (
    <Card title="Uso por chave" action={action}>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-3 text-xs">
              <span className="text-ink font-mono">{row.maskedKey}</span>
              <span className="text-muted font-mono">{row.callsLabel}</span>
            </div>
            <ProgressBar
              value={row.share}
              label={`Uso de ${row.maskedKey}`}
              tone={row.share > 0.5 ? 'lime' : 'deep'}
            />
          </li>
        ))}
      </ul>
      {unusedKey ? (
        <Callout tone="danger">
          A chave <code className="font-mono">{unusedKey.maskedKey}</code> nunca
          foi usada desde {formatDate(unusedKey.createdAt)}. Revogue se não for
          mais necessária.
        </Callout>
      ) : null}
    </Card>
  )
}
