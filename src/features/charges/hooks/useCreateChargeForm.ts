import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { useWallets } from '#/features/wallets/hooks/useWallets'
import type { Network } from '#/features/networks/networks'
import { parseBRLAmount } from '../quote'
import { createChargeFormSchema } from '../schemas'
import { createCharge } from '../services/charges.service'
import type {
  CreateChargeField,
  CreateChargeFieldErrors,
  CreateChargeFormValues,
} from '../types'

const CREATE_CHARGE_FIELDS: ReadonlyArray<CreateChargeField> = [
  'amount',
  'network',
  'walletId',
  'tolerance',
  'reference',
  'customerEmail',
  'description',
  'expiresInMinutes',
  'sendEmail',
]

const INITIAL_VALUES: CreateChargeFormValues = {
  amount: '',
  network: 'sepolia',
  walletId: '',
  tolerance: '0.01',
  reference: '',
  customerEmail: '',
  description: '',
  expiresInMinutes: '30',
  sendEmail: false,
}

type SubmitIntent = 'open' | 'copy'

export function useCreateChargeForm() {
  const navigate = useNavigate()
  const walletsQuery = useWallets()
  const mutation = useMutation({ mutationFn: createCharge })
  const [values, setValues] = useState(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<CreateChargeFieldErrors>({})

  const walletOptions = (walletsQuery.data ?? []).filter(
    (wallet) => wallet.network === values.network,
  )
  // Until the merchant picks one, the network's first wallet is the default.
  const walletId = values.walletId || (walletOptions.at(0)?.id ?? '')
  const amountCents = parseBRLAmount(values.amount) ?? 0

  function setField<TField extends CreateChargeField>(
    field: TField,
    value: CreateChargeFormValues[TField],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  function setNetwork(network: Network) {
    setValues((current) => ({ ...current, network, walletId: '' }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const intent = readIntent(event)
    const parsed = createChargeFormSchema.safeParse({ ...values, walletId })

    if (!parsed.success) {
      const issues = zodIssuesToApiIssues(parsed.error.issues)
      setFieldErrors(toFieldErrors(issues, CREATE_CHARGE_FIELDS))
      return
    }

    const { amount, ...rest } = parsed.data
    mutation.mutate(
      { ...rest, amountCents: parseBRLAmount(amount) ?? 0 },
      {
        onSuccess: async ({ id }) => {
          if (intent === 'open') {
            await navigate({ to: '/pay/$chargeId', params: { chargeId: id } })
            return
          }
          await copyCheckoutLink(id)
          await navigate({ to: '/charges/$chargeId', params: { chargeId: id } })
        },
        onError: (error) => {
          if (error instanceof ApiError)
            setFieldErrors(toFieldErrors(error.issues, CREATE_CHARGE_FIELDS))
        },
      },
    )
  }

  return {
    values: { ...values, walletId },
    amountCents,
    walletOptions,
    setField,
    setNetwork,
    handleSubmit,
    fieldErrors,
    formError: getFormError(mutation.error, CREATE_CHARGE_FIELDS),
    isSubmitting: mutation.isPending,
  }
}

function readIntent(event: FormEvent<HTMLFormElement>): SubmitIntent {
  const submitter = (event.nativeEvent as SubmitEvent).submitter
  return submitter instanceof HTMLButtonElement && submitter.value === 'copy'
    ? 'copy'
    : 'open'
}

async function copyCheckoutLink(chargeId: string) {
  // Clipboard can be denied; creating the charge still succeeded.
  await navigator.clipboard
    .writeText(`${window.location.origin}/pay/${chargeId}`)
    .catch(() => undefined)
}
