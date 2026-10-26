import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { WebhookActions } from '#/features/webhooks/components/WebhookActions'
import { WebhooksView } from '#/features/webhooks/components/WebhooksView'

export const Route = createFileRoute('/_app/webhooks/')({
  component: WebhooksPage,
})

function WebhooksPage() {
  return (
    <Page
      title="Webhooks"
      subtitle="Notificações de cobrança enviadas para a sua loja"
      actions={<WebhookActions />}
    >
      <WebhooksView />
    </Page>
  )
}
