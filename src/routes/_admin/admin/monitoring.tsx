import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { MonitoringView } from '#/features/admin/components/MonitoringView'
import { useMonitoring } from '#/features/admin/hooks/useAdmin'

export const Route = createFileRoute('/_admin/admin/monitoring')({
  component: AdminMonitoringPage,
})

function AdminMonitoringPage() {
  const { data } = useMonitoring()
  const degraded =
    data?.services.filter((service) => service.status === 'degraded').length ??
    0
  const degradedLabel =
    degraded === 1 ? '1 serviço degradado' : `${degraded} serviços degradados`
  const badge = degraded ? (
    <StatusBadge tone="partial">{degradedLabel}</StatusBadge>
  ) : null

  return (
    <Page
      title="Monitoramento"
      subtitle="Indexadores, filas e latência da plataforma"
      actions={badge}
    >
      <MonitoringView />
    </Page>
  )
}
