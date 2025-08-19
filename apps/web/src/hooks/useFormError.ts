import { useState, useCallback } from 'react'

export function useFormError() {
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const setFormError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message)
    } else if (typeof err === 'string') {
      setError(err)
    } else {
      setError('An unexpected error occurred')
    }
  }, [])

  return {
    error,
    setError: setFormError,
    clearError,
  }
}
