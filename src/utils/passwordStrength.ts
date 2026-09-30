export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4

const rules = [
  (pass: string) => pass.length >= 10,
  (pass: string) => /\d/.test(pass),
  (pass: string) => /[^A-Za-z0-9]/.test(pass),
  (pass: string) => /[A-Z]/.test(pass) && /[a-z]/.test(pass),
]

export function calculatePasswordStrength(pass: string): PasswordStrengthScore {
  if (!pass) return 0
  return rules.filter((rule) => rule(pass)).length as PasswordStrengthScore
}