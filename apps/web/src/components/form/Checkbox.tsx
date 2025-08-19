import { forwardRef, InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
  error?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={`rounded border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 transition-colors ${
                error ? 'border-red-300' : ''
              } ${className}`}
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={checkboxId}
              className="font-medium text-gray-700 cursor-pointer"
            >
              {label}
            </label>
            {description && <p className="text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
