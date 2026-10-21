import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { currentUserQueryOptions } from '#/features/auth/queries'

/** Layout das páginas que exigem login: sem sessão, volta para `/auth`. */
export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(currentUserQueryOptions)
    if (!user) throw redirect({ to: '/auth', replace: true })
    return { user }
  },
  component: Outlet,
})
