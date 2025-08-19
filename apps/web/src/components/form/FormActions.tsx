import { ReactNode } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'

interface FormActionsProps {
  onCancel: () => void
  cancelText?: string
  submitText?: string
  isSubmitting?: boolean
  submitIcon?: ReactNode
  disabled?: boolean
  className?: string
}

export function FormActions({
  onCancel,
  cancelText = 'Cancel',
  submitText = 'Save',
  isSubmitting = false,
  submitIcon,
  disabled = false,
  className = '',
}: FormActionsProps) {
  return (
    <div
      className={`flex justify-end space-x-3 pt-6 border-t border-gray-200 ${className}`}
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting || disabled}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className="min-w-[120px] px-4 py-2 text-sm font-medium text-white bg-brand border border-transparent rounded-lg hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner className="w-4 h-4 mr-2" />
            <span>Saving...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {submitIcon && <div className="mr-2">{submitIcon}</div>}
            <span>{submitText}</span>
          </div>
        )}
      </button>
    </div>
  )
}
