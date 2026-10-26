import { useNetworkSettings } from '#/features/wallets/hooks/useWallets'
import { readEnabledNetworks } from '../readForms'
import { useSettingsForm } from '../hooks/useSettingsForm'
import { SETTINGS_FORM_ID, networkSettingsFormSchema } from '../schemas'
import { updateNetworkSettings } from '../services/settings.service'
import { NetworksForm } from './NetworksForm'
import { SettingsLayout } from './SettingsLayout'
import { SettingsTwoColumns } from './SettingsTwoColumns'
import { WalletsAside } from './WalletsAside'
import { WalletsCard } from './WalletsCard'

export function WalletSettings() {
  const networks = useNetworkSettings()
  const form = useSettingsForm({
    schema: networkSettingsFormSchema,
    fields: ['enabledNetworks'],
    read: readEnabledNetworks,
    save: updateNetworkSettings,
  })

  return (
    <SettingsLayout saveStatus={form.saveStatus}>
      <SettingsTwoColumns
        main={
          <>
            <WalletsCard />
            <form
              id={SETTINGS_FORM_ID}
              key={String(networks.dataUpdatedAt)}
              onSubmit={form.handleSubmit}
              onReset={form.handleReset}
              noValidate
            >
              <NetworksForm
                settings={networks.data}
                isPending={networks.isPending}
                isError={networks.isError}
                onRetry={() => void networks.refetch()}
                error={form.fieldErrors.enabledNetworks ?? form.formError}
              />
            </form>
          </>
        }
        aside={<WalletsAside />}
      />
    </SettingsLayout>
  )
}
