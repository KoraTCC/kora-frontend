import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import { Select } from '#/components/ui/Select'
import { useInviteTeamMember } from '../hooks/useSettingsQueries'
import { TEAM_ROLES, inviteFormSchema } from '../schemas'
import { ROLE_META } from './teamRoles'

type InviteMemberDialogProps = {
  open: boolean
  onClose: () => void
}

const ROLE_OPTIONS = TEAM_ROLES.filter((role) => role !== 'owner').map(
  (role) => ({
    value: role,
    label: `${ROLE_META[role].label} · ${ROLE_META[role].scope}`,
  }),
)

export function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const invite = useInviteTeamMember()
  const [emailError, setEmailError] = useState<string>()
  const submitLabel = invite.isPending ? 'Enviando…' : 'Enviar convite'
  const formError = invite.isError
    ? 'Não foi possível enviar o convite.'
    : undefined

  function handleClose() {
    setEmailError(undefined)
    invite.reset()
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const parsed = inviteFormSchema.safeParse({
      email: form.get('email'),
      role: form.get('role'),
    })
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message)
      return
    }
    invite.mutate(parsed.data, { onSuccess: handleClose })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Convidar para a equipe"
      description="O convite expira em 7 dias."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="pessoa@lojaexemplo.com"
          error={emailError}
          data-autofocus=""
        />
        <Select
          label="Papel"
          name="role"
          options={ROLE_OPTIONS}
          defaultValue="developer"
        />
        <FormError message={formError} />
        <Button type="submit" isBlock disabled={invite.isPending}>
          {submitLabel}
        </Button>
      </form>
    </Modal>
  )
}
