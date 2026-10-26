import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import { useInviteMerchant } from '../hooks/useAdmin'
import { inviteMerchantSchema } from '../schemas'

export function InviteMerchantButton() {
  const invite = useInviteMerchant()
  const [isOpen, setIsOpen] = useState(false)
  const [emailError, setEmailError] = useState<string>()
  const submitLabel = invite.isPending ? 'Enviando…' : 'Enviar convite'
  const formError = invite.isError
    ? 'Não foi possível enviar o convite.'
    : undefined

  function handleClose() {
    setIsOpen(false)
    setEmailError(undefined)
    invite.reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = inviteMerchantSchema.safeParse({
      email: new FormData(event.currentTarget).get('email'),
    })
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message)
      return
    }
    invite.mutate(parsed.data, { onSuccess: handleClose })
  }

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        + Convidar lojista
      </Button>
      <Modal
        open={isOpen}
        onClose={handleClose}
        title="Convidar lojista"
        description="O lojista recebe um link para criar a conta. O cadastro entra em análise."
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="E-mail do responsável"
            name="email"
            type="email"
            placeholder="financeiro@loja.com"
            error={emailError}
            data-autofocus=""
          />
          <FormError message={formError} />
          <Button type="submit" isBlock disabled={invite.isPending}>
            {submitLabel}
          </Button>
        </form>
      </Modal>
    </>
  )
}
