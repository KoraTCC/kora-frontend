import type { Merchant } from '../types'

type EnvironmentPillProps = {
  environment: Merchant['environment']
}

const LABELS: Record<Merchant['environment'], string> = {
  test: 'Testnet',
  live: 'Mainnet',
}

export function EnvironmentPill({ environment }: EnvironmentPillProps) {
  return (
    <span className="bg-status-pending-bg border-status-pending-border text-status-pending hidden flex-none items-center gap-[7px] rounded-full border px-[11px] py-1.5 font-mono text-[10px] font-medium tracking-[0.06em] uppercase sm:inline-flex">
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {LABELS[environment]}
    </span>
  )
}
