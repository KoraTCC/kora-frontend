import { ArrowUpRight } from 'lucide-react'
import { AnimatedNumber } from '#/components/ui/AnimatedNumber'
import { ErrorState } from '#/components/ui/ErrorState'
import { LiveTag } from '#/components/ui/LiveTag'
import { SkeletonBox } from '#/components/ui/Skeleton'
import { formatBRL } from '#/lib/money'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

const FRAME_CLASSES =
  'border-lime-line bg-surface relative flex flex-col gap-4 overflow-hidden rounded-[16px] border p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-7'

/** Hero of the dashboard: the balance, counting up as payments land. */
export function BalanceCard() {
  const { data, isPending, isError, refetch } = useDashboardOverview('7d')

  if (isPending) return <BalanceCardSkeleton />
  if (isError)
    return (
      <section className={FRAME_CLASSES}>
        <ErrorState onRetry={() => void refetch()} />
      </section>
    )

  const { balance } = data

  return (
    <section aria-labelledby="balance-title" className={FRAME_CLASSES}>
      <BalanceGlow />
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2
            id="balance-title"
            className="text-muted font-sans text-xs font-semibold tracking-normal"
          >
            Saldo disponível
          </h2>
          <LiveTag />
        </div>
        <p className="font-display text-ink text-[34px] leading-none font-bold tracking-tight sm:text-[44px] lg:text-[52px]">
          <AnimatedNumber
            value={balance.availableCents}
            format={formatBRL}
            durationMs={1400}
          />
        </p>
      </div>

      <p className="bg-lime-bg border-lime-line text-lime relative inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs font-medium">
        <ArrowUpRight size={14} aria-hidden />
        <AnimatedNumber value={balance.todayCents} format={formatBRL} />
        <span className="text-muted">hoje</span>
      </p>
    </section>
  )
}

/** Soft lime halo in the corner; decoration only. */
function BalanceGlow() {
  return (
    <span
      aria-hidden
      className="bg-lime/15 pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-3xl"
    />
  )
}

function BalanceCardSkeleton() {
  return (
    <section role="status" aria-live="polite" className={FRAME_CLASSES}>
      <span className="sr-only">Carregando saldo…</span>
      <div className="flex flex-col gap-3">
        <SkeletonBox className="h-3 w-28" />
        <SkeletonBox className="h-10 w-full max-w-72 lg:h-12" />
      </div>
      <SkeletonBox className="h-7 w-36 rounded-full" />
    </section>
  )
}
