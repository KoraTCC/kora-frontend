import type { Network } from '#/features/networks/networks'

const CHAIN_IDS: Record<Exclude<Network, 'bitcoin-testnet'>, number> = {
  sepolia: 11_155_111,
  amoy: 80_002,
}

const BASE_UNIT_DECIMALS: Record<Network, number> = {
  sepolia: 18,
  amoy: 6,
  'bitcoin-testnet': 8,
}

/**
 * `'0.0384'` with 18 decimals → `'38400000000000000'`. Works on the decimal
 * string, so no floating point rounding sneaks into the amount.
 */
export function toBaseUnits(amount: string, decimals: number): string {
  const [whole = '0', fraction = ''] = amount.split('.')
  const padded = fraction.padEnd(decimals, '0').slice(0, decimals)
  const digits = `${whole}${padded}`.replace(/^0+(?=\d)/, '')
  return digits
}

/**
 * Link that opens the customer's wallet with address and amount filled in:
 * EIP-681 for EVM networks, BIP-21 for Bitcoin.
 */
export function buildPaymentUri(
  network: Network,
  address: string,
  amount: string,
): string {
  if (network === 'bitcoin-testnet')
    return `bitcoin:${address}?amount=${amount}`
  const value = toBaseUnits(amount, BASE_UNIT_DECIMALS[network])
  return `ethereum:${address}@${CHAIN_IDS[network]}?value=${value}`
}
