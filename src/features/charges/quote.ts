import { NETWORK_META } from '#/features/networks/networks'
import type { Network } from '#/features/networks/networks'

/** BRL price of one unit of each asset, in cents — locked when a charge is created. */
export const MOCK_RATES_CENTS: Record<Network, number> = {
  sepolia: 1_353_260,
  amoy: 542,
  'bitcoin-testnet': 35_200_000,
}

/** `24900` cents on Sepolia → `'0.0184'` ETH, with the network's decimals. */
export function estimateCryptoAmount(
  amountCents: number,
  network: Network,
): string {
  const units = amountCents / MOCK_RATES_CENTS[network]
  return units.toFixed(NETWORK_META[network].decimals)
}

/** `'1.290,50'` → `129050`. Returns `null` when it is not a BRL amount. */
export function parseBRLAmount(input: string): number | null {
  const normalized = input.trim().replace(/\./g, '').replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null
  return Math.round(Number(normalized) * 100)
}
