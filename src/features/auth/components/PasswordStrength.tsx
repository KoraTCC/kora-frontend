import { calculatePasswordStrength } from '#/utils/passwordStrength'
import { PASSWORD_MIN_LENGTH } from '../schemas'

const HINT = `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres. Frases longas são mais seguras.`
const SEGMENTS = [1, 2, 3, 4] as const

type PasswordStrengthProps = {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = calculatePasswordStrength(password)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full gap-1.5" aria-hidden>
        {SEGMENTS.map((segment) => (
          <div
            key={segment}
            className={`h-1.5 w-full rounded-full transition-all duration-300 ${
              segment <= score ? 'bg-lime' : 'bg-line'
            }`}
          />
        ))}
      </div>
      <p className="text-dim text-[11px]">{HINT}</p>
    </div>
  )
}
