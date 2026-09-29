import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: string
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <div className="flex items-center gap-2.5">
      <input
        {...props}
        id={checkboxId}
        type="checkbox"
        className="border-line-strong bg-surface checked:border-lime checked:bg-lime focus-visible:ring-lime/25 h-[18px] w-[18px] flex-none cursor-pointer appearance-none rounded-[5px] border transition checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22><path fill=%22%230A0C0A%22 d=%22M4.7 9 1.5 5.8l1.1-1.1 2.1 2.1 4.7-4.7 1.1 1.1z%22/></svg>')] checked:bg-center checked:bg-no-repeat focus-visible:ring-3 focus-visible:outline-none"
      />
      <label
        htmlFor={checkboxId}
        className="text-ink-soft cursor-pointer text-[13px]"
      >
        {label}
      </label>
    </div>
  )
}
