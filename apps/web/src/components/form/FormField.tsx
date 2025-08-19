import { ReactNode } from 'react'

interface FormFieldProps {
  children: ReactNode
  error?: string
  className?: string
  id?: string
}

export function FormField({
  children,
  error,
  className = '',
  id,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`} id={id}>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}
