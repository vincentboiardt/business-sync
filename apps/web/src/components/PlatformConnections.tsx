'use client'

import { useState } from 'react'
import {
  Plus as AddIcon,
  CheckCircle as ConnectedIcon,
  Globe,
  ExternalLink,
  Unlink,
} from 'lucide-react'
import { Button } from './Button'
import { ConnectPlatformModal } from './ConnectPlatformModal'
import { LoadingSpinner } from './LoadingSpinner'
import { usePlatforms } from '../hooks/usePlatforms'

export function PlatformConnections() {
  const { platforms, loading, error } = usePlatforms()
  const [showConnectModal, setShowConnectModal] = useState(false)

  const handleModalClose = () => {
    setShowConnectModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {platforms?.map((platform) => (
        <div key={platform.id} className="border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {platform.connected ? (
              <ConnectedIcon className="h-5 w-5 text-green-600" />
            ) : (
              <AddIcon className="h-5 w-5 text-gray-400" />
            )}
            <p className="font-medium">{platform.display_name}</p>
          </div>
        </div>
      ))}

      <ConnectPlatformModal
        isOpen={showConnectModal}
        onClose={handleModalClose}
        onConnect={() => false}
      />
    </div>
  )
}
