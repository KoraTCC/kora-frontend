import type { DashboardRange } from '../types'
import { AssetDistributionCard } from './AssetDistributionCard'
import { KpiStrip } from './KpiStrip'
import { RecentChargesCard } from './RecentChargesCard'
import { RecentEventsCard } from './RecentEventsCard'
import { SetupStrip } from './SetupStrip'
import { StatusBreakdownCard } from './StatusBreakdownCard'
import { VolumeCard } from './VolumeCard'

type DashboardViewProps = {
  range: DashboardRange
  onRangeChange: (range: DashboardRange) => void
}

const ROW_CLASSES =
  'grid grid-cols-1 items-stretch gap-4 @4xl:grid-cols-[minmax(0,1fr)_320px]'

/**
 * Setup strip → KPI strip → (volume | status + assets) → (charges | events).
 * Each row pairs a wide card with a side column of the same height. The
 * wrapper is a size container, so breakpoints follow the space left by the
 * sidebar instead of the viewport.
 */
export function DashboardView({ range, onRangeChange }: DashboardViewProps) {
  return (
    <div className="@container flex flex-col gap-4">
      <SetupStrip />
      <KpiStrip />
      <div className={ROW_CLASSES}>
        <VolumeCard range={range} onRangeChange={onRangeChange} />
        <div className="flex min-w-0 flex-col gap-4">
          <StatusBreakdownCard />
          <AssetDistributionCard />
        </div>
      </div>
      <div className={ROW_CLASSES}>
        <RecentChargesCard />
        <RecentEventsCard />
      </div>
    </div>
  )
}
