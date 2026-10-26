import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { ApiKeysView } from '#/features/api-keys/components/ApiKeysView'
import { GenerateKeyButton } from '#/features/api-keys/components/GenerateKeyButton'

export const Route = createFileRoute('/_app/api-keys')({
  component: ApiKeysPage,
})

function ApiKeysPage() {
  return (
    <Page
      title="Chaves de API"
      subtitle="Credenciais de integração da loja"
      actions={<GenerateKeyButton />}
    >
      <ApiKeysView />
    </Page>
  )
}
