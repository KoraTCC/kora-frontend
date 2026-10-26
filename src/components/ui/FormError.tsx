type FormErrorProps = {
  message?: string
}

/** Form-level error — field errors live next to their own field. */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <p role="alert" className="text-danger text-center text-[13px]">
      {message}
    </p>
  )
}
