import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '#/features/auth/components/AuthLayout'

export const Route = createFileRoute('/_auth')({
  component: AuthRoute,
})

function AuthRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
