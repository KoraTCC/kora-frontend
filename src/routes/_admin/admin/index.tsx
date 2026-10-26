import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { PillGroup } from '#/components/ui/PillGroup'
import { AdminOverviewView } from '#/features/admin/components/AdminOverviewView'
import { ADMIN_RANGES, overviewSearchSchema } from '#/features/admin/schemas'
import type { AdminRange } from '#/features/admin/types'

const RANGE_OPTIONS = ADMIN_RANGES.map((range) => ({
  value: range,
  label: range.toUpperCase(),
}))

export const Route = createFileRoute('/_admin/admin/')({
  validateSearch: overviewSearchSchema,
  component: AdminOverviewPage,
})

function AdminOverviewPage() {
  const { range = '7d' } = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleRangeChange(nextRange: AdminRange) {
    void navigate({ search: { range: nextRange }, replace: true })
  }

  return (
    <Page
      title="Visão geral"
      subtitle="Saúde da plataforma"
      actions={
        <PillGroup
          label="Período"
          variant="segmented"
          options={RANGE_OPTIONS}
          value={range}
          onChange={handleRangeChange}
        />
      }
    >
      <AdminOverviewView range={range} />
    </Page>
  )
}
