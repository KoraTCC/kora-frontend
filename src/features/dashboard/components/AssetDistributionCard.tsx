import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { ProgressBar } from '#/components/ui/ProgressBar'
import type { ProgressTone } from '#/components/ui/ProgressBar'
import { Skeleton } from '#/components/ui/Skeleton'
import { NETWORK_META } from '#/features/networks/networks'
import { formatPercent } from '#/lib/money'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

const TONES: Array<ProgressTone> = ['lime', 'deep', 'deep']

export function AssetDistributionCard() {
  const { data, isPending, isError, refetch } = useDashboardOverview('7d')

  if (isPending)
    return (
      <Card title="Distribuição por ativo">
        <Skeleton lines={3} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Distribuição por ativo">
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  const rows = data.distribution.map((row, index) => ({
    ...row,
    meta: NETWORK_META[row.network],
    tone: TONES[index] ?? 'deep',
  }))

  return (
    <Card
      title="Distribuição por ativo"
      action={<span className="text-dim font-mono text-[10px]">7D</span>}
    >
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.network} className="flex items-center gap-3">
            <span
              aria-hidden
              className="border-line-strong text-muted flex size-8 flex-none items-center justify-center rounded-full border font-mono text-xs"
            >
              {row.meta.symbol}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex justify-between gap-2 text-xs">
                <span className="text-ink truncate">{row.meta.fullLabel}</span>
                <span className="text-muted font-mono">
                  {formatPercent(row.share, 0)}
                </span>
              </div>
              <ProgressBar
                value={row.share}
                tone={row.tone}
                label={`Participação de ${row.meta.fullLabel}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
