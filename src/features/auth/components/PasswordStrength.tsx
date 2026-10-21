import { calculatePasswordStrength } from '#/utils/passwordStrength'
import { PASSWORD_MIN_LENGTH } from '../schemas'

const HINT = `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres. Frases longas são mais seguras.`

type PasswordStrengthProps = {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = calculatePasswordStrength(password)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1.5 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-full rounded-full transition-all duration-300 ${
              index < score ? 'bg-lime-400' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
      <p className="text-zinc-500 text-xs">{HINT}</p>
    </div>
  )
}
