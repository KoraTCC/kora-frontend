import { Link } from '@tanstack/react-router'
import { Card } from '#/components/ui/Card'
import { Checklist } from '#/components/ui/Checklist'

const PRACTICES = [
  { id: 'server-only', label: 'Chave secreta só no servidor', isDone: true },
  { id: 'rotation', label: 'Rotação nos últimos 90 dias', isDone: true },
  { id: 'ip', label: 'Restringir por IP nas configurações', isDone: false },
  { id: 'unused', label: 'Revogar chaves sem uso', isDone: false },
]

export function BestPracticesCard() {
  return (
    <Card title="Boas práticas">
      <Checklist items={PRACTICES} />
      <Link to="/settings/security" className="text-lime font-mono text-[10px]">
        Abrir configurações de segurança ↗
      </Link>
    </Card>
  )
}
