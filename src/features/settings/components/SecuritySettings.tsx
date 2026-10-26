import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { readText } from '../readForms'
import { readCheckbox, useSettingsForm } from '../hooks/useSettingsForm'
import { useSecuritySettings } from '../hooks/useSettingsQueries'
import { securitySettingsSchema } from '../schemas'
import { updateSecuritySettings } from '../services/settings.service'
import type { SecuritySettings as SecuritySettingsValues } from '../types'
import { SecurityAside } from './SecurityAside'
import { SecurityForm } from './SecurityForm'
import { SettingsLayout } from './SettingsLayout'
import { SettingsTwoColumns } from './SettingsTwoColumns'

type SecurityField = keyof SecuritySettingsValues

const SECURITY_FIELDS: ReadonlyArray<SecurityField> = [
  'twoFactorEnabled',
  'requireTeamTwoFactor',
  'sessionTimeout',
  'lockoutAttempts',
  'allowedIps',
  'notifyNewLocation',
]

export function SecuritySettings() {
  const { data: settings, isPending, isError, refetch } = useSecuritySettings()
  const form = useSettingsForm({
    schema: securitySettingsSchema,
    fields: SECURITY_FIELDS,
    read: readSecurityForm,
    save: updateSecuritySettings,
  })

  if (isPending)
    return (
      <SettingsLayout>
        <Card>
          <Skeleton lines={10} />
        </Card>
      </SettingsLayout>
    )
  if (isError)
    return (
      <SettingsLayout>
        <Card>
          <ErrorState onRetry={() => void refetch()} />
        </Card>
      </SettingsLayout>
    )

  return (
    <SettingsLayout saveStatus={form.saveStatus}>
      <SettingsTwoColumns
        main={
          <SecurityForm
            settings={settings}
            onSubmit={form.handleSubmit}
            onReset={form.handleReset}
            fieldErrors={form.fieldErrors}
            formError={form.formError}
          />
        }
        aside={<SecurityAside />}
      />
    </SettingsLayout>
  )
}

function readSecurityForm(form: FormData) {
  return {
    twoFactorEnabled: readCheckbox(form, 'twoFactorEnabled'),
    requireTeamTwoFactor: readCheckbox(form, 'requireTeamTwoFactor'),
    sessionTimeout: readText(form, 'sessionTimeout'),
    lockoutAttempts: readText(form, 'lockoutAttempts'),
    allowedIps: readText(form, 'allowedIps'),
    notifyNewLocation: readCheckbox(form, 'notifyNewLocation'),
  } satisfies Record<SecurityField, unknown>
}
