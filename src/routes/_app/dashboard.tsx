import { createFileRoute, Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { Page } from '#/components/layout/Page'
import { DashboardView } from '#/features/dashboard/components/DashboardView'
import { dashboardSearchSchema } from '#/features/dashboard/schemas'
import type { DashboardRange } from '#/features/dashboard/types'
import { getGreeting } from '#/features/dashboard/greeting'

export const Route = createFileRoute('/_app/dashboard')({
  validateSearch: dashboardSearchSchema,
  component: DashboardPage,
})

function DashboardPage() {
  const { range = '7d' } = Route.useSearch()
  const { user } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  function handleRangeChange(nextRange: DashboardRange) {
    void navigate({ search: { range: nextRange }, replace: true })
  }

  return (
    <Page
      title="Dashboard"
      subtitle={`${getGreeting(user.name)} Aqui está o resumo de hoje.`}
      actions={
        <Link to="/charges/new" className={buttonClasses({ size: 'sm' })}>
          + Nova cobrança
        </Link>
      }
    >
      <DashboardView range={range} onRangeChange={handleRangeChange} />
    </Page>
  )
}
