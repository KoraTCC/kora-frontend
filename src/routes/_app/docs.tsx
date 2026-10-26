import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { DocsView } from '#/features/docs/components/DocsView'

export const Route = createFileRoute('/_app/docs')({
  component: DocsPage,
})

function DocsPage() {
  return (
    <Page
      title="Documentação"
      subtitle="Integre o checkout da Kora em quatro passos"
    >
      <DocsView />
    </Page>
  )
}
