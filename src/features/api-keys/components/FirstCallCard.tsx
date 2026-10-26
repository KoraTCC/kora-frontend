import { Link } from '@tanstack/react-router'
import { Card } from '#/components/ui/Card'
import { CodeBlock } from '#/components/ui/CodeBlock'

const FIRST_CALL = [
  'curl https://api.kora.dev/v1/charges \\',
  '  -u sk_test_91be…: \\',
  '  -d amount=24900 \\',
  '  -d currency=BRL \\',
  '  -d network=sepolia',
].join('\n')

export function FirstCallCard() {
  return (
    <Card title="Primeira chamada">
      <CodeBlock code={FIRST_CALL} label="Exemplo de chamada com curl" />
      <Link to="/docs" className="text-lime font-mono text-[10px]">
        Ver documentação completa ↗
      </Link>
    </Card>
  )
}
