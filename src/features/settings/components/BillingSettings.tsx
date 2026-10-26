import { useState } from 'react'
import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Skeleton } from '#/components/ui/Skeleton'
import { readText } from '../readForms'
import { readCheckbox, useSettingsForm } from '../hooks/useSettingsForm'
import { useBillingSettings } from '../hooks/useSettingsQueries'
import { SETTINGS_FORM_ID, billingSettingsSchema } from '../schemas'
import { updateBillingSettings } from '../services/settings.service'
import type { BillingSettings as BillingSettingsValues } from '../types'
import { BillingAside } from './BillingAside'
import { CustomerCommunicationCard } from './CustomerCommunicationCard'
import { PaymentRulesCard } from './PaymentRulesCard'
import { SettingsLayout } from './SettingsLayout'
import { SettingsTwoColumns } from './SettingsTwoColumns'

type BillingField = keyof BillingSettingsValues

const BILLING_FIELDS: ReadonlyArray<BillingField> = [
  'defaultTolerance',
  'defaultWindowMinutes',
  'referenceCurrency',
  'defaultNetwork',
  'acceptOverpayment',
  'autoExpire',
  'sendReceipt',
  'notifyDetected',
  'remindBeforeExpiry',
  'senderEmail',
  'returnUrl',
]

export function BillingSettings() {
  const { data: settings, isPending, isError, refetch } = useBillingSettings()

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

  return <BillingSettingsForm settings={settings} />
}

function BillingSettingsForm({
  settings,
}: {
  settings: BillingSettingsValues
}) {
  const [tolerance, setTolerance] = useState(settings.defaultTolerance)
  const [paymentWindow, setPaymentWindow] = useState(
    settings.defaultWindowMinutes,
  )
  const form = useSettingsForm({
    schema: billingSettingsSchema,
    fields: BILLING_FIELDS,
    read: readBillingForm,
    save: updateBillingSettings,
  })
  const errors = form.fieldErrors

  function handleReset() {
    setTolerance(settings.defaultTolerance)
    setPaymentWindow(settings.defaultWindowMinutes)
    form.handleReset()
  }

  return (
    <SettingsLayout saveStatus={form.saveStatus}>
      <SettingsTwoColumns
        main={
          <form
            id={SETTINGS_FORM_ID}
            onSubmit={form.handleSubmit}
            onReset={handleReset}
            noValidate
            className="flex flex-col gap-4"
          >
            <PaymentRulesCard
              settings={settings}
              tolerance={tolerance}
              onToleranceChange={setTolerance}
              paymentWindow={paymentWindow}
              onWindowChange={setPaymentWindow}
            />
            <CustomerCommunicationCard settings={settings} errors={errors} />
            <FormError message={form.formError} />
          </form>
        }
        aside={<BillingAside />}
      />
    </SettingsLayout>
  )
}

function readBillingForm(form: FormData) {
  return {
    defaultTolerance: readText(form, 'defaultTolerance'),
    defaultWindowMinutes: readText(form, 'defaultWindowMinutes'),
    referenceCurrency: readText(form, 'referenceCurrency'),
    defaultNetwork: readText(form, 'defaultNetwork'),
    acceptOverpayment: readCheckbox(form, 'acceptOverpayment'),
    autoExpire: readCheckbox(form, 'autoExpire'),
    sendReceipt: readCheckbox(form, 'sendReceipt'),
    notifyDetected: readCheckbox(form, 'notifyDetected'),
    remindBeforeExpiry: readCheckbox(form, 'remindBeforeExpiry'),
    senderEmail: readText(form, 'senderEmail'),
    returnUrl: readText(form, 'returnUrl'),
  } satisfies Record<BillingField, unknown>
}
