import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import {
  useCreateWebhookEndpoint,
  useSendTestWebhook,
} from '../hooks/useWebhooks'
import { newEndpointFormSchema } from '../schemas'

const TEST_LABELS = {
  idle: 'Enviar teste',
  pending: 'Enviando…',
  success: 'Teste enviado',
  error: 'Falhou',
} as const

/** Top bar actions of the webhooks page. */
export function WebhookActions() {
  const sendTest = useSendTestWebhook()
  const create = useCreateWebhookEndpoint()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [urlError, setUrlError] = useState<string>()
  const createError = create.isError
    ? 'Não foi possível cadastrar o endpoint.'
    : undefined
  const createLabel = create.isPending ? 'Cadastrando…' : 'Cadastrar endpoint'

  function handleClose() {
    setIsCreateOpen(false)
    setUrlError(undefined)
    create.reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = newEndpointFormSchema.safeParse({
      url: new FormData(event.currentTarget).get('url'),
    })
    if (!parsed.success) {
      setUrlError(parsed.error.issues[0]?.message)
      return
    }
    create.mutate(parsed.data, { onSuccess: handleClose })
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => sendTest.mutate()}
        disabled={sendTest.isPending}
      >
        <span aria-live="polite">{TEST_LABELS[sendTest.status]}</span>
      </Button>
      <Button size="sm" onClick={() => setIsCreateOpen(true)}>
        + Novo endpoint
      </Button>
      <Modal
        open={isCreateOpen}
        onClose={handleClose}
        title="Novo endpoint"
        description="A Kora envia um POST assinado para esta URL a cada evento."
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="URL do endpoint"
            name="url"
            type="url"
            placeholder="https://sualoja.com/kora/hooks"
            error={urlError}
            data-autofocus=""
          />
          <FormError message={createError} />
          <Button type="submit" isBlock disabled={create.isPending}>
            {createLabel}
          </Button>
        </form>
      </Modal>
    </>
  )
}
