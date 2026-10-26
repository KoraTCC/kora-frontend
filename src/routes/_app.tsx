import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { currentUserQueryOptions } from '#/features/auth/queries'
import { MerchantShell } from '#/features/merchant/components/MerchantShell'

/** Pages that require a session: without one, back to `/auth`. */
export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(currentUserQueryOptions)
    if (!user) throw redirect({ to: '/auth', replace: true })
    return { user }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <MerchantShell>
      <Outlet />
    </MerchantShell>
  )
}
