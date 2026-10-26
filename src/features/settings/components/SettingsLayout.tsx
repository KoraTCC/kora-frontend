import type { ReactNode } from 'react'
import { Page } from '#/components/layout/Page'
import { Button } from '#/components/ui/Button'
import { TabNav } from '#/components/ui/TabNav'
import type { TabNavItem } from '#/components/ui/TabNav'
import { useMerchant } from '#/features/merchant/hooks/useMerchant'
import { SETTINGS_FORM_ID } from '../schemas'

export type SaveStatus = 'idle' | 'pending' | 'success' | 'error'

type SettingsLayoutProps = {
  /** Tabs with a form get "Descartar" / "Salvar" in the top bar. */
  saveStatus?: SaveStatus
  children: ReactNode
}

const TABS: Array<TabNavItem> = [
  { label: 'Perfil', to: '/settings/profile' },
  { label: 'Carteiras e redes', to: '/settings/wallets' },
  { label: 'Cobrança', to: '/settings/billing' },
  { label: 'Equipe', to: '/settings/team' },
  { label: 'Segurança', to: '/settings/security' },
]

const SAVE_LABELS: Record<SaveStatus, string> = {
  idle: 'Salvar alterações',
  pending: 'Salvando…',
  success: 'Alterações salvas',
  error: 'Tentar salvar de novo',
}

export function SettingsLayout({ saveStatus, children }: SettingsLayoutProps) {
  const { data: merchant } = useMerchant()
  const subtitle = merchant ? `${merchant.name} · ${merchant.id}` : undefined
  const actions = saveStatus ? (
    <>
      <Button type="reset" form={SETTINGS_FORM_ID} variant="ghost" size="sm">
        Descartar
      </Button>
      <Button
        type="submit"
        form={SETTINGS_FORM_ID}
        size="sm"
        disabled={saveStatus === 'pending'}
      >
        <span aria-live="polite">{SAVE_LABELS[saveStatus]}</span>
      </Button>
    </>
  ) : null

  return (
    <Page title="Configurações" subtitle={subtitle} actions={actions}>
      <TabNav label="Seções das configurações" items={TABS} />
      {children}
    </Page>
  )
}
