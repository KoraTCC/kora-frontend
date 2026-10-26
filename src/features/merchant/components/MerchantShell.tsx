import { useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  FileText,
  KeyRound,
  LayoutGrid,
  LogOut,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Webhook,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { AppShell } from '#/components/layout/AppShell'
import { Sidebar } from '#/components/layout/Sidebar'
import type { SidebarSection, SidebarItem } from '#/components/layout/Sidebar'
import { Avatar } from '#/components/ui/Avatar'
import { useCurrentUser } from '#/features/auth/hooks/useCurrentUser'
import { useLogout } from '#/features/auth/hooks/useLogout'
import { getInitials } from '#/features/auth/initials'
import { SearchBox } from '#/components/ui/SearchBox'
import { useChargeStats } from '#/features/charges/hooks/useCharges'
import { useWebhookEndpoints } from '#/features/webhooks/hooks/useWebhooks'
import { useMerchant } from '../hooks/useMerchant'
import { EnvironmentPill } from './EnvironmentPill'
import { MerchantAccountCard } from './MerchantAccountCard'

type MerchantShellProps = {
  children: ReactNode
}

/** The merchant panel: navigation, account, search and user in one frame. */
export function MerchantShell({ children }: MerchantShellProps) {
  const navigate = useNavigate()
  const { data: merchant } = useMerchant()
  const { data: user } = useCurrentUser()
  const { data: stats } = useChargeStats()
  const { data: endpoints } = useWebhookEndpoints()
  const { handleLogout } = useLogout()

  const pendingCount = stats?.counts.pending ?? 0
  const hasFailingWebhook = Boolean(
    endpoints?.some((endpoint) => endpoint.status === 'failing'),
  )
  const sections = buildSections(pendingCount, hasFailingWebhook)
  const footerItems: Array<SidebarItem> = [
    { label: 'Configurações', icon: Settings2, to: '/settings' },
    { label: 'Documentação', icon: BookOpen, to: '/docs' },
    { label: 'Painel administrativo', icon: ShieldCheck, to: '/admin' },
    { label: 'Sair', icon: LogOut, onClick: handleLogout },
  ]
  const initials = user ? getInitials(user.name) : '··'

  function handleSearch(query: string) {
    void navigate({ to: '/charges', search: { q: query || undefined } })
  }

  return (
    <AppShell
      renderSidebar={(onNavigate) => (
        <Sidebar
          account={<MerchantAccountCard />}
          sections={sections}
          footerItems={footerItems}
          onNavigate={onNavigate}
        />
      )}
      topbarStart={
        <SearchBox label="Buscar cobranças" onSearch={handleSearch} />
      }
      topbarEnd={
        <>
          {merchant ? (
            <EnvironmentPill environment={merchant.environment} />
          ) : null}
          <Avatar initials={initials} label={user?.name ?? 'Usuário'} />
        </>
      }
    >
      {children}
    </AppShell>
  )
}

function buildSections(
  pendingCount: number,
  hasFailingWebhook: boolean,
): Array<SidebarSection> {
  return [
    {
      label: 'Operação',
      items: [
        { label: 'Dashboard', icon: LayoutGrid, to: '/dashboard' },
        {
          label: 'Cobranças',
          icon: ReceiptText,
          to: '/charges',
          indicator: <CountBadge count={pendingCount} label="pendentes" />,
        },
        { label: 'Chaves de API', icon: KeyRound, to: '/api-keys' },
        {
          label: 'Webhooks',
          icon: Webhook,
          to: '/webhooks',
          indicator: hasFailingWebhook ? (
            <AlertDot label="endpoint falhando" />
          ) : null,
        },
        { label: 'Logs', icon: FileText, to: '/logs' },
      ],
    },
  ]
}

function CountBadge({ count, label }: { count: number; label: string }) {
  if (count === 0) return null
  return (
    <span className="bg-lime text-on-lime rounded-full px-1.5 font-mono text-[10px] font-medium">
      {count}
      <span className="sr-only"> {label}</span>
    </span>
  )
}

function AlertDot({ label }: { label: string }) {
  return (
    <span className="bg-status-failed size-1.5 rounded-full">
      <span className="sr-only">{label}</span>
    </span>
  )
}
