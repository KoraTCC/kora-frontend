import type { DashboardOverview } from './types'

export type SetupStep = DashboardOverview['integration'][number]

export type SetupProgress = {
  doneCount: number
  total: number
  isComplete: boolean
  /** First step still to do, if any. */
  nextStep?: SetupStep
}

/** How far the merchant is in the onboarding checklist. */
export function getSetupProgress(
  steps: ReadonlyArray<SetupStep>,
): SetupProgress {
  const doneCount = steps.filter((step) => step.isDone).length
  return {
    doneCount,
    total: steps.length,
    isComplete: doneCount === steps.length,
    nextStep: steps.find((step) => !step.isDone),
  }
}
