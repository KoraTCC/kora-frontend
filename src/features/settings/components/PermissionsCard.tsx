import { Card } from '#/components/ui/Card'
import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { TEAM_ROLES } from '../schemas'
import { PERMISSIONS, ROLE_META } from './teamRoles'

type PermissionRow = (typeof PERMISSIONS)[number]

const COLUMNS: Array<Column<PermissionRow>> = [
  {
    key: 'permission',
    header: 'Permissão',
    cell: (row) => <span className="text-ink">{row.label}</span>,
    className: 'w-full',
  },
  ...TEAM_ROLES.map((role) => ({
    key: role,
    header: ROLE_META[role].label,
    cell: (row: PermissionRow) => (
      <PermissionMark isAllowed={row.roles.includes(role)} />
    ),
  })),
]

function PermissionMark({ isAllowed }: { isAllowed: boolean }) {
  if (!isAllowed)
    return (
      <span className="text-dim" aria-label="Não">
        —
      </span>
    )
  return (
    <span className="text-lime" aria-label="Sim">
      ✓
    </span>
  )
}

export function PermissionsCard() {
  return (
    <Card title="O que cada papel pode fazer" isFlush>
      <DataTable
        caption="Permissões por papel"
        columns={COLUMNS}
        rows={PERMISSIONS}
        getRowKey={(row) => row.id}
        minWidth={560}
      />
    </Card>
  )
}
