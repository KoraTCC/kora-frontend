import { describe, expect, it } from 'vitest'
import {
  loginResponseSchema,
  recoveryCodeSchema,
  twoFactorCredentialSchema,
  twoFactorSchema,
  userSchema,
} from './schemas'

describe('2FA schemas', () => {
  it('login: aceita a sessão ou o pedido de código', () => {
    const user = {
      id: 'u1',
      name: 'Ana',
      email: 'ana@example.com',
      createdAt: '2026-11-26T00:00:00.000Z',
      twoFactorEnabled: true,
    }
    expect(loginResponseSchema.parse({ user })).toEqual({ user })
    expect(loginResponseSchema.parse({ twoFactorRequired: true })).toEqual({
      twoFactorRequired: true,
    })
    expect(() =>
      loginResponseSchema.parse({ twoFactorRequired: false }),
    ).toThrow()
  })

  it('usuário sem o campo novo continua válido (twoFactorEnabled = false)', () => {
    const parsed = userSchema.parse({
      id: 'u1',
      name: 'Ana',
      email: 'ana@example.com',
      createdAt: '2026-11-26T00:00:00.000Z',
    })
    expect(parsed.twoFactorEnabled).toBe(false)
  })

  it('código do app: exatamente 6 dígitos', () => {
    expect(twoFactorSchema.safeParse({ code: '123456' }).success).toBe(true)
    expect(twoFactorSchema.safeParse({ code: '12345' }).success).toBe(false)
    expect(twoFactorSchema.safeParse({ code: 'abcdef' }).success).toBe(false)
  })

  it.each(['abcd-2345', 'ABCD-2345', 'abcd2345', ' abcd-2345 '])(
    'código de recuperação aceito: "%s"',
    (code) => {
      expect(recoveryCodeSchema.safeParse({ code }).success).toBe(true)
    },
  )

  it('código de recuperação recusa formato errado', () => {
    expect(recoveryCodeSchema.safeParse({ code: 'abc-123' }).success).toBe(
      false,
    )
    expect(recoveryCodeSchema.safeParse({ code: '123456' }).success).toBe(false)
  })

  it('credencial (desativar/regenerar): app ou recuperação', () => {
    expect(twoFactorCredentialSchema.safeParse('123456').success).toBe(true)
    expect(twoFactorCredentialSchema.safeParse('abcd-2345').success).toBe(true)
    expect(twoFactorCredentialSchema.safeParse('12').success).toBe(false)
  })
})
