import { useCsvExport } from '#/hooks/useCsvExport'
import { NETWORK_META } from '#/features/networks/networks'
import { CHARGE_STATUS_META } from '../chargeStatus'
import type { Charge } from '../types'

const HEADER = [
  'id',
  'pedido',
  'cliente',
  'valor_brl',
  'valor_cripto',
  'ativo',
  'rede',
  'status',
  'criada_em',
]

/** Exports the charges on screen as CSV. */
export function useExportCharges() {
  const exportCsv = useCsvExport()

  return (charges: ReadonlyArray<Charge>) => {
    const rows = charges.map((charge) => [
      charge.id,
      charge.reference,
      charge.customerEmail,
      (charge.amountCents / 100).toFixed(2),
      charge.cryptoAmount,
      charge.asset,
      NETWORK_META[charge.network].label,
      CHARGE_STATUS_META[charge.status].label,
      charge.createdAt,
    ])
    exportCsv('cobrancas.csv', HEADER, rows)
  }
}
