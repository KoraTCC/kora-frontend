import type { Merchant } from '../types'

type EnvironmentPillProps = {
  environment: Merchant['environment']
}

const LABELS: Record<Merchant['environment'], string> = {
  test: 'Testnet',
  live: 'Mainnet',
}

/** Test or live network, shown next to the brand in the sidebar. */
export function EnvironmentPill({ environment }: EnvironmentPillProps) {
  return (
    <span className="bg-status-pending-bg border-status-pending-border text-status-pending inline-flex flex-none items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-medium tracking-[0.06em] uppercase">
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {LABELS[environment]}
    </span>
  )
}
