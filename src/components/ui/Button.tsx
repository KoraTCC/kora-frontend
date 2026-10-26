import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '#/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'md' | 'sm'

type ButtonStyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Fills the parent's width. */
  isBlock?: boolean
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonStyleOptions

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-[10px] border transition focus-visible:ring-3 focus-visible:ring-lime/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-lime text-on-lime border-lime font-bold hover:bg-lime-soft',
  secondary:
    'bg-surface-2 text-ink border-line-strong font-semibold hover:border-muted',
  ghost:
    'border-transparent bg-transparent text-muted font-semibold hover:text-ink',
  danger: 'bg-danger text-on-lime border-danger font-bold hover:opacity-90',
}

// `sm` keeps a 44px touch target on mobile and shrinks from `lg` up.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-12 px-[18px] text-sm',
  sm: 'h-11 px-[13px] text-[13px] lg:h-9',
}

/** Button look for elements that are not a `<button>`, such as router links. */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  isBlock = false,
}: ButtonStyleOptions = {}): string {
  return cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    isBlock && 'w-full',
  )
}

export function Button({
  variant,
  size,
  isBlock,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(buttonClasses({ variant, size, isBlock }), className)}
    />
  )
}
