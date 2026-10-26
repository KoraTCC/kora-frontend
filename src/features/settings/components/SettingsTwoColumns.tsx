import type { ReactNode } from 'react'

type SettingsTwoColumnsProps = {
  main: ReactNode
  aside: ReactNode
}

/** Form on the left, context on the right; stacks below `xl`. */
export function SettingsTwoColumns({ main, aside }: SettingsTwoColumnsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_372px]">
      <div className="flex min-w-0 flex-col gap-4">{main}</div>
      <div className="flex min-w-0 flex-col gap-4">{aside}</div>
    </div>
  )
}
