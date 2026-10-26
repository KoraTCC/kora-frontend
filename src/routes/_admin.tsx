import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '#/features/admin/components/AdminShell'
import { requireSession } from '#/features/auth/requireSession'

/**
 * Operator console. TODO(api): kora-backend has no operator role yet, so any
 * signed-in user gets in; gate on the role once `/auth/me` exposes it.
 */
export const Route = createFileRoute('/_admin')({
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
