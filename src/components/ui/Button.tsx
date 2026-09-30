import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-lime text-on-lime border-lime hover:bg-lime-soft',
  secondary: 'bg-surface-2 text-ink-soft border-line-strong hover:text-ink',
  ghost: 'border-transparent bg-transparent text-muted hover:text-ink',
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`inline-flex h-12 w-full items-center justify-center rounded-[10px] border font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${VARIANT_CLASSES[variant]} ${className}`}
    />
  )
}
