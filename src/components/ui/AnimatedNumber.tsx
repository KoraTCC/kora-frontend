import { useCountUp } from '#/hooks/useCountUp'

type AnimatedNumberProps = {
  value: number
  /** Turns the in-between value into text — `formatBRL`, a percentage… */
  format?: (value: number) => string
  durationMs?: number
}

const defaultFormat = (value: number) =>
  Math.round(value).toLocaleString('pt-BR')

/**
 * A number that counts up to its value. Screen readers get only the final
 * value, never the frames in between.
 */
export function AnimatedNumber({
  value,
  format = defaultFormat,
  durationMs,
}: AnimatedNumberProps) {
  const current = useCountUp(value, durationMs)
  const displayed = format(current)
  const final = format(value)

  return (
    <span className="tabular-nums">
      <span aria-hidden>{displayed}</span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
