import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { CopyField } from '#/components/ui/CopyField'
import { FormError } from '#/components/ui/FormError'
import { Modal } from '#/components/ui/Modal'
import { useCreateApiKey } from '../hooks/useApiKeys'

/** Creates a test secret key and shows it once, in a dialog. */
export function GenerateKeyButton() {
  const create = useCreateApiKey()
  const submitLabel = create.isPending ? 'Gerando…' : '+ Gerar chave'
  const errorMessage = create.isError
    ? 'Não foi possível gerar a chave.'
    : undefined

  return (
    <>
      <Button
        size="sm"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {submitLabel}
      </Button>
      <FormError message={errorMessage} />
      <Modal
        open={create.isSuccess}
        onClose={() => create.reset()}
        title="Nova chave secreta"
        description="Copie agora: por segurança, ela não aparece inteira de novo."
        footer={
          <Button isBlock onClick={() => create.reset()}>
            Já copiei
          </Button>
        }
      >
        <CopyField
          value={create.data?.secretKey ?? ''}
          label="Nova chave secreta"
        />
        <Callout tone="warning">
          Guarde a chave só no servidor. Nunca no navegador.
        </Callout>
      </Modal>
    </>
  )
}
