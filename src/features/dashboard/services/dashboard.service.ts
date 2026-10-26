import { mockRequest } from '#/lib/mock'
import { dashboardOverviewSchema } from '../schemas'
import type { DashboardOverview, DashboardRange } from '../types'

// TODO(api): kora-backend has no dashboard endpoint yet; see src/lib/mock.ts.

const MINUTE_MS = 60_000

const VOLUME_BY_RANGE: Record<
  DashboardRange,
  Pick<DashboardOverview['volume'], 'totalCents' | 'delta' | 'points'>
> = {
  '24h': {
    totalCents: 612_340,
    delta: 0.031,
    points: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'].map(
      (label, index) => ({
        label,
        value: [12, 9, 22, 41, 38, 52, 47][index],
      }),
    ),
  },
  '7d': {
    totalCents: 4_198_250,
    delta: 0.082,
    points: ['22 ago', '23', '24', '25', '26', '27', '28 ago'].map(
      (label, index) => ({
        label,
        value: [18, 26, 23, 37, 34, 45, 41, 52, 48][index],
      }),
    ),
  },
  '30d': {
    totalCents: 16_402_900,
    delta: 0.146,
    points: ['30 jul', '06 ago', '13 ago', '20 ago', '28 ago'].map(
      (label, index) => ({
        label,
        value: [80, 96, 91, 124, 138][index],
      }),
    ),
  },
}

export function getDashboardOverview(
  range: DashboardRange,
): Promise<DashboardOverview> {
  const now = Date.now()
  const minutesAgo = (minutes: number) =>
    new Date(now - minutes * MINUTE_MS).toISOString()

  return mockRequest(`/dashboard?range=${range}`, {
    schema: dashboardOverviewSchema,
    response: {
      volume: {
        ...VOLUME_BY_RANGE[range],
        breakdown: '≈ 0,6412 ETH · 1.284 USDT',
      },
      distribution: [
        { network: 'sepolia', share: 0.62 },
        { network: 'amoy', share: 0.27 },
        { network: 'bitcoin-testnet', share: 0.11 },
      ],
      integration: [
        { id: 'api-key', label: 'Gerar chave de API', isDone: true },
        {
          id: 'wallet',
          label: 'Cadastrar carteira de recebimento',
          isDone: true,
        },
        {
          id: 'webhook',
          label: 'Configurar endpoint de webhook',
          isDone: false,
        },
        { id: 'test', label: 'Fazer uma cobrança de teste', isDone: false },
      ],
      events: [
        {
          id: 'ev_1',
          tone: 'confirmed',
          title: 'Cobrança ch_8f21a4 confirmada',
          detail: '12 confirmações',
          at: minutesAgo(2),
        },
        {
          id: 'ev_2',
          tone: 'detected',
          title: 'Pagamento detectado em ch_5ac733',
          detail: '0x7a3f…9c21',
          at: minutesAgo(14),
        },
        {
          id: 'ev_3',
          tone: 'failed',
          title: 'Webhook charge.confirmed falhou (502)',
          detail: '3ª tentativa',
          at: minutesAgo(21),
        },
        {
          id: 'ev_4',
          tone: 'pending',
          title: 'Cobrança ch_71bd09 criada',
          detail: 'R$ 89,00',
          at: minutesAgo(6),
        },
      ],
    },
  })
}
