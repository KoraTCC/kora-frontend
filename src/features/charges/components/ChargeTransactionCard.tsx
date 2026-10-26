import { Card } from '#/components/ui/Card'
import { CopyField } from '#/components/ui/CopyField'
import type { ChargeDetail } from '../types'

type ChargeTransactionCardProps = {
  charge: ChargeDetail
}

export function ChargeTransactionCard({ charge }: ChargeTransactionCardProps) {
  return (
    <Card title="Transação">
      <div className="flex flex-col gap-1.5">
        <p className="text-muted text-xs">Endereço de recebimento</p>
        <CopyField value={charge.address} label="Endereço de recebimento" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-muted text-xs">Hash da transação</p>
        {charge.txHash ? (
          <CopyField value={charge.txHash} label="Hash da transação" />
        ) : (
          <p className="text-dim font-mono text-[11px]">
            Aguardando o pagamento na rede.
          </p>
        )}
      </div>
    </Card>
  )
}
