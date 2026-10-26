import {
  ArrowLeft,
  FileText,
  LayoutGrid,
  LogOut,
  ReceiptText,
  Activity,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { AppShell } from '#/components/layout/AppShell'
import { Sidebar } from '#/components/layout/Sidebar'
import type { SidebarItem, SidebarSection } from '#/components/layout/Sidebar'
import { useLogout } from '#/features/auth/hooks/useLogout'
import { useMonitoring } from '../hooks/useAdmin'
import { OperatorCard } from './OperatorCard'

type AdminShellProps = {
  children: ReactNode
}

/** Operator console: same shell as the merchant panel, different navigation. */
export function AdminShell({ children }: AdminShellProps) {
  const { data: monitoring } = useMonitoring()
  const { handleLogout } = useLogout()
  const hasDegradedService = Boolean(
    monitoring?.services.some((service) => service.status === 'degraded'),
  )
  const sections = buildSections(hasDegradedService)
  const footerItems: Array<SidebarItem> = [
    { label: 'Voltar ao lojista', icon: ArrowLeft, to: '/dashboard' },
    { label: 'Sair', icon: LogOut, onClick: handleLogout },
  ]

  return (
    <AppShell
      renderSidebar={(onNavigate) => (
        <Sidebar
          brandTag={
            <span className="border-lime-line text-lime rounded-[5px] border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.08em] uppercase">
              Admin
            </span>
          }
          account={<OperatorCard />}
          sections={sections}
          footerItems={footerItems}
          onNavigate={onNavigate}
        />
      )}
    >
      {children}
    </AppShell>
  )
}

function buildSections(hasDegradedService: boolean): Array<SidebarSection> {
  return [
    {
      label: 'Plataforma',
      items: [
        {
          label: 'Visão geral',
          icon: LayoutGrid,
          to: '/admin',
          isExact: true,
        },
        { label: 'Lojistas', icon: Users, to: '/admin/merchants' },
        { label: 'Cobranças', icon: ReceiptText, to: '/admin/charges' },
      ],
    },
    {
      label: 'Operação',
      items: [
        {
          label: 'Monitoramento',
          icon: Activity,
          to: '/admin/monitoring',
          indicator: hasDegradedService ? (
            <span className="bg-status-pending size-1.5 rounded-full">
              <span className="sr-only">serviço degradado</span>
            </span>
          ) : null,
        },
        { label: 'Auditoria', icon: FileText, to: '/admin/audit' },
      ],
    },
  ]
}
