import { z } from 'zod'

export const NETWORKS = ['sepolia', 'amoy', 'bitcoin-testnet'] as const
export const networkSchema = z.enum(NETWORKS)
export type Network = z.infer<typeof networkSchema>

export const ASSETS = ['ETH', 'USDT', 'BTC'] as const
export const assetSchema = z.enum(ASSETS)
export type Asset = z.infer<typeof assetSchema>

type NetworkMeta = {
  /** Short name — "Sepolia". */
  label: string
  /** Asset · chain, as the checkout shows it — "Ethereum · Sepolia". */
  fullLabel: string
  asset: Asset
  /** Glyph used in asset badges. */
  symbol: string
  requiredConfirmations: number
  averageConfirmation: string
  /** Decimal places shown for amounts on this network. */
  decimals: number
}

export const NETWORK_META: Record<Network, NetworkMeta> = {
  sepolia: {
    label: 'Sepolia',
    fullLabel: 'Ethereum · Sepolia',
    asset: 'ETH',
    symbol: 'Ξ',
    requiredConfirmations: 12,
    averageConfirmation: '≈ 2 min',
    decimals: 4,
  },
  amoy: {
    label: 'Amoy',
    fullLabel: 'USDT · Polygon Amoy',
    asset: 'USDT',
    symbol: 'T',
    requiredConfirmations: 30,
    averageConfirmation: '≈ 1 min',
    decimals: 2,
  },
  'bitcoin-testnet': {
    label: 'Testnet',
    fullLabel: 'Bitcoin · Testnet',
    asset: 'BTC',
    symbol: 'B',
    requiredConfirmations: 3,
    averageConfirmation: '≈ 30 min',
    decimals: 6,
  },
}

/** `ETH · Sepolia` — how tables name the asset and network together. */
export function formatAssetNetwork(network: Network): string {
  const meta = NETWORK_META[network]
  return `${meta.asset} · ${meta.label}`
}

/** `0x7a3f9b2c4e81…d419c21f` → `0x7a3f…c21f`. */
export function shortenAddress(address: string, visible = 4): string {
  if (address.length <= visible * 2 + 3) return address
  const prefixLength = address.startsWith('0x') ? visible + 2 : visible
  return `${address.slice(0, prefixLength)}…${address.slice(-visible)}`
}

const EXPLORER_TX_URLS: Record<Network, string> = {
  sepolia: 'https://sepolia.etherscan.io/tx/',
  amoy: 'https://amoy.polygonscan.com/tx/',
  'bitcoin-testnet': 'https://mempool.space/testnet/tx/',
}

/** Public block explorer page of a transaction. */
export function explorerTxUrl(network: Network, txHash: string): string {
  return `${EXPLORER_TX_URLS[network]}${txHash}`
}
