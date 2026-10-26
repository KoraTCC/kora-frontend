import type { ReactNode } from 'react'

type CheckoutCardProps = {
  children: ReactNode
}

/** Narrow centered column used by every post-payment state. */
export function CheckoutCard({ children }: CheckoutCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 p-5 sm:p-8">
      {children}
    </div>
  )
}
