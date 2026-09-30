import { useState } from 'react'
import { Input } from './Input'
import type { ComponentProps } from 'react'

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  'type' | 'trailing'
>

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleLabel = isVisible ? 'Ocultar' : 'Mostrar'

  return (
    <Input
      {...props}
      type={isVisible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-muted hover:text-ink flex-none cursor-pointer text-[11px] transition"
        >
          {toggleLabel}
        </button>
      }
    />
  )
}
