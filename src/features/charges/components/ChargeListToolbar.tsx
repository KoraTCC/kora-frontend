import { Download } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import { Select } from '#/components/ui/Select'
import { NETWORKS, NETWORK_META } from '#/features/networks/networks'
import type { ChargeListSearch } from '../types'
import { ChargeSearchBox } from './ChargeSearchBox'

const NETWORK_OPTIONS = [
  { value: '', label: 'Todas as redes' },
  ...NETWORKS.map((network) => ({
    value: network,
    label: NETWORK_META[network].fullLabel,
  })),
]

type ChargeListToolbarProps = {
  search: ChargeListSearch
  onQueryChange: (query: string) => void
  onNetworkChange: (network: string) => void
  onExport: () => void
  canExport: boolean
}

export function ChargeListToolbar({
  search,
  onQueryChange,
  onNetworkChange,
  onExport,
  canExport,
}: ChargeListToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="sm:w-72">
        <ChargeSearchBox
          key={search.q}
          defaultValue={search.q}
          onSearch={onQueryChange}
          placeholder="Buscar ID, pedido ou e-mail…"
        />
      </div>
      <Select
        label="Rede"
        isLabelHidden
        options={NETWORK_OPTIONS}
        value={search.network ?? ''}
        onChange={(event) => onNetworkChange(event.target.value)}
        className="sm:w-52"
      />
      <Button
        variant="secondary"
        onClick={onExport}
        disabled={!canExport}
        className="h-11 lg:h-12"
      >
        <Download size={14} aria-hidden />
        Exportar CSV
      </Button>
    </div>
  )
}
