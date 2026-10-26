import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Skeleton } from '#/components/ui/Skeleton'
import { useMerchant } from '#/features/merchant/hooks/useMerchant'
import { merchantProfileFormSchema } from '#/features/merchant/schemas'
import { updateMerchantProfile } from '#/features/merchant/services/merchant.service'
import type { MerchantProfileField } from '#/features/merchant/types'
import { readCheckbox, useSettingsForm } from '../hooks/useSettingsForm'
import { SETTINGS_FORM_ID } from '../schemas'
import { ProfileAside } from './ProfileAside'
import { ProfileFormFields } from './ProfileFormFields'
import { SettingsLayout } from './SettingsLayout'
import { SettingsTwoColumns } from './SettingsTwoColumns'

const PROFILE_FIELDS: ReadonlyArray<MerchantProfileField> = [
  'name',
  'legalName',
  'document',
  'phone',
  'email',
  'website',
  'displayName',
  'showLogo',
  'showBackButton',
  'postalCode',
  'street',
  'complement',
  'city',
  'state',
  'country',
]

export function ProfileSettings() {
  const { data: merchant, isPending, isError, refetch } = useMerchant()
  const form = useSettingsForm({
    schema: merchantProfileFormSchema,
    fields: PROFILE_FIELDS,
    read: readProfileForm,
    save: updateMerchantProfile,
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

  const errors = form.fieldErrors

  return (
    <SettingsLayout saveStatus={form.saveStatus}>
      <SettingsTwoColumns
        main={
          <form
            id={SETTINGS_FORM_ID}
            key={merchant.id}
            onSubmit={form.handleSubmit}
            onReset={form.handleReset}
            noValidate
            className="flex flex-col gap-4"
          >
            <ProfileFormFields merchant={merchant} errors={errors} />
            <FormError message={form.formError} />
          </form>
        }
        aside={<ProfileAside merchant={merchant} />}
      />
    </SettingsLayout>
  )
}

function readProfileForm(form: FormData) {
  const text = (name: string) => String(form.get(name) ?? '')
  return {
    name: text('name'),
    legalName: text('legalName'),
    document: text('document'),
    phone: text('phone'),
    email: text('email'),
    website: text('website'),
    displayName: text('displayName'),
    showLogo: readCheckbox(form, 'showLogo'),
    showBackButton: readCheckbox(form, 'showBackButton'),
    postalCode: text('postalCode'),
    street: text('street'),
    complement: text('complement'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
  } satisfies Record<MerchantProfileField, unknown>
}
