import { describe, expect, it } from 'vitest'
import { getSetupProgress } from './setupProgress'

const steps = [
  { id: 'api-key', label: 'Gerar chave de API', isDone: true },
  { id: 'wallet', label: 'Cadastrar carteira', isDone: true },
  { id: 'webhook', label: 'Configurar webhook', isDone: false },
  { id: 'test', label: 'Cobrança de teste', isDone: false },
]

describe('getSetupProgress', () => {
  it('counts the done steps and points at the first one left', () => {
    expect(getSetupProgress(steps)).toEqual({
      doneCount: 2,
      total: 4,
      isComplete: false,
      nextStep: steps[2],
    })
  })

  it('is complete when every step is done', () => {
    const done = steps.map((step) => ({ ...step, isDone: true }))
    const progress = getSetupProgress(done)
    expect(progress.isComplete).toBe(true)
    expect(progress.nextStep).toBeUndefined()
  })
})
