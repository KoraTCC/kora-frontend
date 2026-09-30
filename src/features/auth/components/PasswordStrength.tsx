import { calculatePasswordStrength } from '#/utils/passwordStrength'

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
      <p className="text-zinc-500 text-xs">
        Mínimo de 10 caracteres, com número e símbolo
      </p>
    </div>
  )
}