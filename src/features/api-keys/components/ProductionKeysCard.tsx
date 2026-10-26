import { Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { StatusBadge } from '#/components/ui/StatusBadge'

/** Locked until the store is verified and has a mainnet wallet. */
export function ProductionKeysCard() {
  return (
    <Card
      title={<span className="text-muted">Produção</span>}
      action={<StatusBadge tone="expired">Bloqueado</StatusBadge>}
    >
      <p className="text-dim text-[11px]">
        Conclua a verificação da loja e cadastre uma carteira de mainnet para
        liberar as chaves de produção.
      </p>
      <Link
        to="/settings/profile"
        className={buttonClasses({ variant: 'secondary', isBlock: true })}
      >
        Concluir verificação
      </Link>
    </Card>
  )
}
