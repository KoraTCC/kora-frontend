import type { DescriptionItem } from '#/components/ui/DescriptionList'

export type DocSection = {
  id: string
  title: string
  intro: string
  facts: ReadonlyArray<DescriptionItem>
  code: string
  codeLabel: string
}

/** Static integration guide — four steps, in order. */
export const DOC_SECTIONS: ReadonlyArray<DocSection> = [
  {
    id: 'autenticacao',
    title: 'Autenticação',
    intro:
      'Toda chamada usa HTTP Basic com a chave secreta como usuário e senha vazia. Nunca exponha a chave secreta no navegador.',
    facts: [
      { label: 'Base URL', value: 'api.kora.dev' },
      { label: 'Versão', value: '/v1' },
      { label: 'Formato', value: 'JSON · UTF-8' },
    ],
    code: 'curl https://api.kora.dev/v1/charges \\\n  -u sk_test_demo_91be_59d0:',
    codeLabel: 'Exemplo de autenticação',
  },
  {
    id: 'criar-cobranca',
    title: 'Criar uma cobrança',
    intro:
      'A Kora devolve um endereço único e a URL do checkout. A cotação fica travada até a expiração.',
    facts: [
      { label: 'amount', value: 'inteiro · centavos' },
      { label: 'currency', value: 'BRL, USD, EUR' },
      { label: 'network', value: 'sepolia, amoy' },
      { label: 'reference', value: 'seu id de pedido' },
      { label: 'expires_in', value: 'segundos' },
    ],
    code: [
      'POST /v1/charges',
      '',
      '{',
      '  "amount": 24900,',
      '  "currency": "BRL",',
      '  "network": "sepolia",',
      '  "reference": "#10483",',
      '  "expires_in": 1800',
      '}',
      '',
      '← 201 Created',
      '{',
      '  "id": "ch_8f21a4",',
      '  "status": "pending",',
      '  "address": "0x7a3f9b2c…d419c21f",',
      '  "amount_crypto": "0.0184",',
      '  "checkout_url": "https://pay.kora.dev/ch_8f21a4"',
      '}',
    ].join('\n'),
    codeLabel: 'Requisição e resposta para criar uma cobrança',
  },
  {
    id: 'receber-webhook',
    title: 'Receber o webhook',
    intro:
      'Valide o cabeçalho Kora-Signature com o segredo do endpoint antes de confiar no corpo da requisição.',
    facts: [
      { label: 'Algoritmo', value: 'HMAC-SHA256' },
      { label: 'Tolerância', value: '5 min' },
      { label: 'Retentativas', value: '5 · backoff' },
      { label: 'Timeout', value: '30 s' },
    ],
    code: [
      'Kora-Signature: t=1756392483,v1=9f21ba4c0e77…',
      '',
      '{',
      '  "event": "charge.confirmed",',
      '  "charge_id": "ch_8f21a4",',
      '  "tx_hash": "0x91be44ad…2f80d3ca",',
      '  "confirmations": 12',
      '}',
    ].join('\n'),
    codeLabel: 'Exemplo de webhook recebido',
  },
  {
    id: 'testar',
    title: 'Testar ponta a ponta',
    intro:
      'Crie uma cobrança de teste, pague com uma carteira de testnet e acompanhe a entrega do webhook na tela de Webhooks.',
    facts: [
      { label: 'Faucet Sepolia', value: 'sepoliafaucet.com' },
      { label: 'Faucet Amoy', value: 'faucet.polygon.technology' },
    ],
    code: 'POST /v1/webhooks/test\n\n← 200 OK',
    codeLabel: 'Disparar um webhook de teste',
  },
]
