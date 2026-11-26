import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { AnimatedNumber } from '#/components/ui/AnimatedNumber'
import { ErrorState } from '#/components/ui/ErrorState'
import { LiveTag } from '#/components/ui/LiveTag'
import { SkeletonBox } from '#/components/ui/Skeleton'
import { useChargeStats } from '#/features/charges/hooks/useCharges'
import { cn } from '#/lib/cn'
import { formatBRL, formatSignedPercent } from '#/lib/money'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

const STRIP_CLASSES =
  'bg-line-soft border-line grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border @lg:grid-cols-2 @4xl:grid-cols-4'

/**
 * The four numbers that matter at a glance, in one strip. Columns follow the
 * dashboard's width (container queries), not the viewport.
 */
export function KpiStrip() {
  const overview = useDashboardOverview('7d')
  const stats = useChargeStats()

  if (overview.isPending || stats.isPending) return <KpiStripSkeleton />
  if (overview.isError || stats.isError)
    return (
      <section className="bg-surface border-line rounded-[14px] border p-4">
        <ErrorState
          onRetry={() => {
            void overview.refetch()
            void stats.refetch()
          }}
        />
      </section>
    )

  const { balance, volume } = overview.data
  const { counts, pendingAmountCents } = stats.data
  const partialLabel =
    counts.partial === 1
      ? '1 pagamento parcial'
      : `${counts.partial} pagamentos parciais`

  return (
    <section aria-label="Indicadores" className={STRIP_CLASSES}>
      <KpiCell
        isHighlighted
        label="Saldo disponível"
        badge={<LiveTag />}
        value={
          <AnimatedNumber
            value={balance.availableCents}
            format={formatBRL}
            durationMs={1400}
          />
        }
        hint={
          <>
            <span className="text-lime font-bold">
              + <AnimatedNumber value={balance.todayCents} format={formatBRL} />
            </span>{' '}
            recebidos hoje
          </>
        }
      />
      <KpiCell
        label="Recebido em 7 dias"
        value={<AnimatedNumber value={volume.totalCents} format={formatBRL} />}
        hint={
          <>
            <span className="bg-lime-bg text-lime-deep rounded-full px-1.5 py-px font-bold">
              {formatSignedPercent(volume.delta)}
            </span>{' '}
            vs. semana anterior
          </>
        }
      />
      <KpiCell
        label="Aguardando pagamento"
        value={<AnimatedNumber value={counts.pending} />}
        hint={`${formatBRL(pendingAmountCents)} em cobranças abertas`}
      />
      <KpiCell
        label="Precisam de revisão"
        value={<AnimatedNumber value={counts.partial} />}
        hint={
          <Link
            to="/charges"
            search={{ status: 'partial' }}
            className="font-semibold"
          >
            {partialLabel} →
          </Link>
        }
      />
    </section>
  )
}

type KpiCellProps = {
  label: string
  value: ReactNode
  hint: ReactNode
  badge?: ReactNode
  /** The balance cell stands out from the rest. */
  isHighlighted?: boolean
}

function KpiCell({ label, value, hint, badge, isHighlighted }: KpiCellProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 p-5',
        isHighlighted ? 'bg-lime-bg' : 'bg-surface',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h2
          className={cn(
            'text-[13px] font-semibold',
            isHighlighted ? 'text-lime-deep' : 'text-muted',
          )}
        >
          {label}
        </h2>
        {badge}
      </div>
      <p className="font-display text-ink text-[28px] leading-none font-semibold tracking-tight tabular-nums lg:text-[30px]">
        {value}
      </p>
      <p className="text-muted text-[13px]">{hint}</p>
    </div>
  )
}

function KpiStripSkeleton() {
  return (
    <section role="status" aria-live="polite" className={STRIP_CLASSES}>
      <span className="sr-only">Carregando indicadores…</span>
      {['balance', 'volume', 'pending', 'review'].map((cell) => (
        <div key={cell} className="bg-surface flex flex-col gap-3 p-5">
          <SkeletonBox className="h-3 w-28" />
          <SkeletonBox className="h-8 w-40" />
          <SkeletonBox className="h-3 w-32" />
        </div>
      ))}
    </section>
  )
}
