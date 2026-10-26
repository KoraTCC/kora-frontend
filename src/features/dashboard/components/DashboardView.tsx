import type { DashboardRange } from '../types'
import { AssetDistributionCard } from './AssetDistributionCard'
import { DashboardKpis } from './DashboardKpis'
import { IntegrationCard } from './IntegrationCard'
import { RecentChargesCard } from './RecentChargesCard'
import { RecentEventsCard } from './RecentEventsCard'
import { VolumeCard } from './VolumeCard'

type DashboardViewProps = {
  range: DashboardRange
  onRangeChange: (range: DashboardRange) => void
}

export function DashboardView({ range, onRangeChange }: DashboardViewProps) {
  return (
    <>
      <DashboardKpis />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex min-w-0 flex-col gap-4">
          <VolumeCard range={range} onRangeChange={onRangeChange} />
          <RecentChargesCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <IntegrationCard />
          <AssetDistributionCard />
          <RecentEventsCard />
        </div>
      </div>
    </>
  )
}
