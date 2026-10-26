import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireSession } from '#/features/auth/requireSession'
import { MerchantShell } from '#/features/merchant/components/MerchantShell'

/** Pages that require a session: without one, back to `/auth`. */
export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  component: AppLayout,
})

function AppLayout() {
  return (
    <MerchantShell>
      <Outlet />
    </MerchantShell>
  )
}
