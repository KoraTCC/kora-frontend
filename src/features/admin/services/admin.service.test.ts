import { describe, expect, it } from 'vitest'
import {
  listAdminMerchants,
  listAudit,
  listGlobalCharges,
} from './admin.service'

describe('admin service (mock)', () => {
  it('filters merchants by status and search, and pages them', async () => {
    const suspended = await listAdminMerchants({ status: 'suspended' }, 8)
    expect(
      suspended.items.every((merchant) => merchant.status === 'suspended'),
    ).toBe(true)

    const byName = await listAdminMerchants({ q: 'vila' }, 8)
    expect(byName.items.map((merchant) => merchant.name)).toEqual([
      'Mercado Vila',
    ])

    const secondPage = await listAdminMerchants({ page: 2 }, 8)
    expect(secondPage.page).toBe(2)
    expect(secondPage.items).toHaveLength(8)
  })

  it('filters global charges by network', async () => {
    const page = await listGlobalCharges({ network: 'amoy' }, 8)
    expect(page.distribution[0]).toEqual({ status: 'confirmed', share: 0.62 })
    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((charge) => charge.network === 'amoy')).toBe(true)
  })

  it('scopes audit entries', async () => {
    const system = await listAudit({ scope: 'system' }, 50)
    expect(system.items.every((entry) => entry.isSystem)).toBe(true)
    const critical = await listAudit({ scope: 'critical' }, 50)
    expect(critical.items.every((entry) => entry.isCritical)).toBe(true)
  })
})
