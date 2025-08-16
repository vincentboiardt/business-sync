'use client'

import { useState } from 'react'
import { X, Globe, ExternalLink } from 'lucide-react'

interface Platform {
  id: string
  name: string
  description: string
  authUrl?: string
  comingSoon?: boolean
}

interface ConnectPlatformModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (platformId: string) => void
}

const platforms: Platform[] = [
  {
    id: 'google',
    name: 'Google Business Profile',
    description: 'Sync with Google My Business to manage your Google listing.',
    authUrl: '/api/auth/signin/google',
  },
  {
    id: 'bing',
    name: 'Bing Places',
    description: 'Manage your business listing on Bing Maps.',
    comingSoon: true,
  },
  {
    id: 'apple',
    name: 'Apple Maps',
    description: 'Connect to Apple Maps Connect for iOS users.',
    comingSoon: true,
  },
  {
    id: 'facebook',
    name: 'Facebook Business',
    description: 'Sync with your Facebook Business page.',
    comingSoon: true,
  },
  {
    id: 'yelp',
    name: 'Yelp Business',
    description: 'Manage your Yelp business listing and reviews.',
    comingSoon: true,
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    description: 'Connect your TripAdvisor business listing.',
    comingSoon: true,
  },
]

export function ConnectPlatformModal({
  isOpen,
  onClose,
  onConnect,
}: ConnectPlatformModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConnect = async (platform: Platform) => {
    if (platform.comingSoon) return

    setConnecting(platform.id)

    try {
      if (platform.authUrl) {
        window.location.href = platform.authUrl
      } else {
        onConnect(platform.id)
      }
    } catch (error) {
      console.error('Error connecting platform:', error)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Connect Platform</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 mb-6">
            Choose a platform to connect and sync your business information.
          </p>

          <div className="grid gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`border rounded-lg p-4 ${
                  platform.comingSoon
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-300 hover:border-brand cursor-pointer'
                }`}
                onClick={() => !platform.comingSoon && handleConnect(platform)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h3
                        className={`font-medium ${
                          platform.comingSoon
                            ? 'text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {platform.name}
                        {platform.comingSoon && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </h3>
                      <p
                        className={`text-sm ${
                          platform.comingSoon
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}
                      >
                        {platform.description}
                      </p>
                    </div>
                  </div>

                  {!platform.comingSoon && (
                    <div className="flex items-center">
                      {connecting === platform.id ? (
                        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-brand/5 rounded-lg">
            <h4 className="font-medium text-brand mb-2">
              What happens when you connect?
            </h4>
            <ul className="text-sm text-brand/80 space-y-1">
              <li>
                • You&apos;ll be redirected to the platform&apos;s authorization
                page
              </li>
              <li>• Grant permission to access your business listing</li>
              <li>• Your business information will be synced automatically</li>
              <li>• You can disconnect at any time from your dashboard</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
