import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { INPUT_ALLOW, Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import { Select } from '#/components/ui/Select'
import { NETWORKS, NETWORK_META } from '#/features/networks/networks'
import type { Network } from '#/features/networks/networks'
import { useAddWallet } from '../hooks/useSettingsQueries'
import { newWalletFormSchema } from '../schemas'

type AddWalletDialogProps = {
  open: boolean
  onClose: () => void
  /** Network preselected when the dialog opens — e.g. the charge's network. */
  defaultNetwork?: Network
}

const NETWORK_OPTIONS = NETWORKS.map((network) => ({
  value: network,
  label: NETWORK_META[network].fullLabel,
}))

export function AddWalletDialog({
  open,
  onClose,
  defaultNetwork = 'sepolia',
}: AddWalletDialogProps) {
  const add = useAddWallet()
  const [addressError, setAddressError] = useState<string>()
  const submitLabel = add.isPending ? 'Adicionando…' : 'Adicionar carteira'
  // The API explains the failure (e.g. "Essa carteira já está cadastrada.").
  const formError = add.error?.message

  function handleClose() {
    setAddressError(undefined)
    add.reset()
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const parsed = newWalletFormSchema.safeParse({
      address: form.get('address'),
      network: form.get('network'),
    })
    if (!parsed.success) {
      setAddressError(parsed.error.issues[0]?.message)
      return
    }
    add.mutate(parsed.data, { onSuccess: handleClose })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Adicionar carteira"
      description="Os pagamentos dessa rede caem direto neste endereço. Depois, assine uma mensagem para provar a posse."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Select
          key={defaultNetwork}
          label="Rede"
          name="network"
          options={NETWORK_OPTIONS}
          defaultValue={defaultNetwork}
        />
        <Input
          label="Endereço"
          name="address"
          allow={INPUT_ALLOW.walletAddress}
          maxLength={90}
          placeholder="0x…"
          error={addressError}
          data-autofocus=""
        />
        <FormError message={formError} />
        <Button type="submit" isBlock disabled={add.isPending}>
          {submitLabel}
        </Button>
      </form>
    </Modal>
  )
}
