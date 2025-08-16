'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Globe,
  LogOut,
  Plus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Building2,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
} from 'lucide-react'
import { ConnectPlatformModal } from '~/components/ConnectPlatformModal'
import { useAuth } from '~/components/providers'

interface PlatformConnection {
  id: string
  name: string
  connected: boolean
  status: 'synced' | 'pending' | 'error'
  lastSync?: string
}

interface BusinessProfile {
  name: string
  address?: string
  phone?: string
  website?: string
  hours?: Record<string, string>
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    {
      id: 'google',
      name: 'Google Business Profile',
      connected: false,
      status: 'pending',
    },
    { id: 'bing', name: 'Bing Places', connected: false, status: 'pending' },
    { id: 'apple', name: 'Apple Maps', connected: false, status: 'pending' },
    { id: 'facebook', name: 'Facebook', connected: false, status: 'pending' },
    { id: 'yelp', name: 'Yelp', connected: false, status: 'pending' },
    {
      id: 'tripadvisor',
      name: 'TripAdvisor',
      connected: false,
      status: 'pending',
    },
  ])

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: '',
    address: '',
    phone: '',
    website: '',
    hours: {},
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [showConnectModal, setShowConnectModal] = useState(false)

  useEffect(() => {
    if (!user && !authLoading) {
      console.log('go to singin page', user, authLoading)
      router.push('/auth/signin')
      return
    }

    // Fetch business profile when user is authenticated
    if (user) {
      fetchBusinessProfile()
    }
  }, [user, authLoading, router])

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/business-profile')
      if (response.ok) {
        const data = await response.json()
        setBusinessProfile({
          name: data.business_name || '',
          address: data.address || '',
          phone: data.phone || '',
          website: data.website || '',
          hours: data.opening_hours || {},
        })
      } else if (response.status === 404) {
        // No business profile exists yet - this is fine for new users
        console.log('No business profile found - user needs to set one up')
      }
    } catch (error) {
      console.error('Error fetching business profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncFromGoogleBusiness = async () => {
    try {
      setSyncing(true)
      setSyncMessage(null)
      const response = await fetch('/api/sync-google-business', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // Update the business profile with the synced data
        setBusinessProfile({
          name: data.profile.business_name || '',
          address: data.profile.address || '',
          phone: data.profile.phone || '',
          website: data.profile.website || '',
          hours: data.profile.opening_hours || {},
        })
        setSyncMessage({
          type: 'success',
          text: 'Successfully synced business information from Google Business!',
        })
        // Clear message after 5 seconds
        setTimeout(() => setSyncMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setSyncMessage({
          type: 'error',
          text: errorData.error || 'Failed to sync from Google Business',
        })
        console.error('Error syncing from Google Business:', errorData.error)
      }
    } catch (error) {
      setSyncMessage({
        type: 'error',
        text: 'Network error while syncing from Google Business',
      })
      console.error('Error syncing from Google Business:', error)
    } finally {
      setSyncing(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const connectPlatform = (platformId: string) => {
    // This would connect to the actual platform APIs
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              connected: true,
              status: 'synced' as const,
              lastSync: 'Just now',
            }
          : p
      )
    )
  }

  const syncAll = () => {
    // This would trigger a sync across all connected platforms
    setPlatforms((prev) =>
      prev.map((p) =>
        p.connected
          ? { ...p, status: 'synced' as const, lastSync: 'Just now' }
          : p
      )
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-brand" />
              <span className="text-2xl font-bold text-gray-900">
                BusinessSync
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage your business information across all platforms from one
            place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>
              <button
                onClick={syncAll}
                className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All Platforms
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <Building2 className="h-8 w-8 text-brand mb-2" />
                <h3 className="font-medium text-gray-900">Business Profile</h3>
                <p className="text-sm text-gray-600">
                  Update your business information
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Opening Hours</h3>
                <p className="text-sm text-gray-600">
                  Manage your business hours
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Plus className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">Add Photos</h3>
                <p className="text-sm text-gray-600">Upload business photos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Profile Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Business Profile
              </h2>
            </div>
            {syncMessage && (
              <div
                className={`mx-6 mt-4 p-3 rounded-lg ${
                  syncMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <div className="flex items-center">
                  {syncMessage.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  {syncMessage.text}
                </div>
              </div>
            )}
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">
                    Loading business profile...
                  </p>
                </div>
              ) : businessProfile.name ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <p className="text-gray-900">{businessProfile.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <p className="text-gray-900">
                        {businessProfile.address || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">
                        {businessProfile.phone || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      {businessProfile.website ? (
                        <a
                          href={businessProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:text-brand/80"
                        >
                          {businessProfile.website}
                        </a>
                      ) : (
                        <p className="text-gray-900">Not set</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No business profile found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Sync your Google Business Profile to import your business
                    information.
                  </p>
                  <button
                    onClick={syncFromGoogleBusiness}
                    disabled={syncing}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      'Sync from Google Business'
                    )}
                  </button>
                </div>
              )}
              <div className="pt-4 space-y-2">
                <button
                  onClick={syncFromGoogleBusiness}
                  disabled={syncing}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync from Google Business
                    </>
                  )}
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Business Information
                </button>
              </div>
            </div>
          </div>

          {/* Platform Connections */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Platform Connections
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {platform.name}
                        </h3>
                        {platform.connected && (
                          <p className="text-sm text-gray-500">
                            Last sync: {platform.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {platform.connected ? (
                        <div className="flex items-center space-x-2">
                          {platform.status === 'synced' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {platform.status === 'error' && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="text-sm text-green-600 font-medium">
                            Connected
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConnectModal(true)}
                          className="bg-brand text-white px-3 py-1 rounded text-sm hover:bg-brand/90 transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-900">
                    Google Business Profile synchronized successfully
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-brand/5 rounded-lg">
                <Globe className="h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm text-gray-900">
                    Business hours updated
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Plus className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-900">
                    New business photos uploaded
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Platform Modal */}
      <ConnectPlatformModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={connectPlatform}
      />
    </div>
  )
}
