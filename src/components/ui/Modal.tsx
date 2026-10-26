import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import { cn } from '#/lib/cn'
import { IconButton } from './IconButton'

type ModalSize = 'sm' | 'md' | 'lg'
type ModalAlign = 'start' | 'center'
type ModalVariant = 'dialog' | 'drawer'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  size?: ModalSize
  /** Header alignment. */
  align?: ModalAlign
  /** `drawer` slides from the left edge, full height (mobile navigation); its title is visually hidden. */
  variant?: ModalVariant
  footer?: ReactNode
  children?: ReactNode
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[472px]',
  lg: 'max-w-[640px]',
}

const VARIANT_CLASSES: Record<
  ModalVariant,
  { dialog: string; body: string; header: string }
> = {
  dialog: {
    dialog: 'm-auto w-[calc(100%-2rem)] rounded-[18px] border',
    body: 'gap-6 px-5 pt-12 pb-6 sm:px-8 sm:pt-10 sm:pb-8',
    header: 'flex flex-col gap-2',
  },
  drawer: {
    dialog:
      'my-0 mr-auto ml-0 h-dvh max-h-none w-[min(300px,86vw)] rounded-none border-r',
    body: 'h-full',
    header: 'sr-only',
  },
}

const ALIGN_CLASSES: Record<ModalAlign, string> = {
  start: 'text-left',
  center: 'text-center',
}

/**
 * The only modal in the app. Built on the native `<dialog>` + `showModal()`,
 * which traps focus, makes the page behind inert, closes on `Esc` and returns
 * focus to the trigger — once, for every use case. Mark an element inside
 * with `data-autofocus` to receive the initial focus.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  align = 'start',
  variant = 'dialog',
  footer,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const variantClasses = VARIANT_CLASSES[variant]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialog.showModal()
    // showModal() focuses the first focusable (the close button); content can
    // claim initial focus instead with `data-autofocus`.
    dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()

    // Runs on close and on unmount alike, so focus always goes back.
    return () => {
      dialog.close()
      trigger?.focus()
    }
  }, [open])

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Let React state own visibility instead of the browser.
    event.preventDefault()
    onClose()
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={cn(
        'bg-raised border-line-strong text-ink backdrop:bg-overlay p-0 shadow-(--elev-2)',
        variantClasses.dialog,
        variant === 'dialog' && SIZE_CLASSES[size],
      )}
    >
      {open ? (
        <div className={cn('relative flex flex-col', variantClasses.body)}>
          <IconButton
            label="Fechar"
            icon={<X size={14} aria-hidden />}
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-[18px] sm:right-[18px]"
          />

          <header className={cn(variantClasses.header, ALIGN_CLASSES[align])}>
            <h2
              id={titleId}
              className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
            >
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-muted text-[13px]">
                {description}
              </p>
            ) : null}
          </header>

          {children}

          {footer ? (
            <footer className="flex flex-col gap-3">{footer}</footer>
          ) : null}
        </div>
      ) : null}
    </dialog>
  )
}
