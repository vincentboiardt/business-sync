'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Globe, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { APP_NAME } from '~/lib/constants'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand/15 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Globe className="h-8 w-8 text-brand" />
            <span className="text-2xl font-bold text-gray-900">{APP_NAME}</span>
          </div>

          <div className="mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600">
              {errorMessages[error] || errorMessages.Default}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full bg-brand text-white py-3 px-4 rounded-lg hover:bg-brand/90 transition-colors inline-block"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                Error code: <code className="font-mono">{error}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand/15 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Globe className="h-8 w-8 text-brand" />
                <span className="text-2xl font-bold text-gray-900">
                  {APP_NAME}
                </span>
              </div>
              <div className="mb-6">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Loading...
                </h1>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
