import { Link } from '@tanstack/react-router'
import { Card } from '#/components/ui/Card'
import { CodeBlock } from '#/components/ui/CodeBlock'
import type { Network } from '#/features/networks/networks'

type ChargeApiSnippetCardProps = {
  amountCents: number
  network: Network
}

/** The same charge, as an API call — mirrors the form as it changes. */
export function ChargeApiSnippetCard({
  amountCents,
  network,
}: ChargeApiSnippetCardProps) {
  const code = [
    'POST /v1/charges',
    `{ "amount": ${amountCents},`,
    '  "currency": "BRL",',
    `  "network": "${network}" }`,
  ].join('\n')

  return (
    <Card
      title="Criar pela API"
      action={
        <Link to="/docs" className="text-lime font-mono text-[10px]">
          Documentação ↗
        </Link>
      }
    >
      <CodeBlock
        code={code}
        label="Exemplo de requisição para criar a cobrança"
      />
    </Card>
  )
}
