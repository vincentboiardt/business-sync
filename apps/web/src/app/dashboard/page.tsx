'use client'

import {
  CheckCircle as SuccessIcon,
  Building2 as ProfileIcon,
  Clock as HoursIcon,
  Plus as AddIcon,
  Globe as BrandIcon,
} from 'lucide-react'
import { useState } from 'react'
import { PlatformConnections } from '~/components/PlatformConnections'
import { Card } from '~/components/Card'
import { PageHeader } from '~/components/PageHeader'
import { Page } from '~/components/Page'
import { BusinessProfileCard } from '~/components/business-profile/BusinessProfileCard'
import { BusinessProfileForm } from '~/components/business-profile/BusinessProfileForm'

export default function DashboardPage() {
  const [showBusinessProfileForm, setShowBusinessProfileForm] = useState(false)

  const quickActions = [
    {
      icon: <ProfileIcon className="h-8 w-8 text-brand mb-2" />,
      title: 'Business Profile',
      description: 'Update your business information',
      onClick: () => setShowBusinessProfileForm(true),
    },
    {
      icon: <HoursIcon className="h-8 w-8 text-green-600 mb-2" />,
      title: 'Opening Hours',
      description: 'Manage your business hours',
      onClick: () => setShowBusinessProfileForm(true),
    },
    {
      icon: <AddIcon className="h-8 w-8 text-purple-600 mb-2" />,
      title: 'Add Photos',
      description: 'Upload business photos',
      onClick: () => {
        // TODO: Implement photo upload functionality
      },
    },
  ]

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description="Manage your business information across all platforms from one place."
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Quick Actions" className="col-span-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={item.onClick}
              >
                {item.icon}
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-subdued">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
        {/* Business Profile Summary */}
        <BusinessProfileCard />

        {/* Platform Connections */}
        <Card title="Platform Connections">
          <PlatformConnections />
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" className="col-span-full">
          <div className="space-y-4">
            {[
              {
                icon: <SuccessIcon className="h-5 w-5 text-green-500" />,
                bg: 'bg-green-50',
                title: 'Google Business Profile synchronized successfully',
                time: '2 hours ago',
              },
              {
                icon: <BrandIcon className="h-5 w-5 text-brand" />,
                bg: 'bg-brand/5',
                title: 'Business hours updated',
                time: '1 day ago',
              },
              {
                icon: <AddIcon className="h-5 w-5 text-purple-500" />,
                bg: 'bg-purple-50',
                title: 'New business photos uploaded',
                time: '3 days ago',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center space-x-3 p-3 ${item.bg} rounded-lg`}
              >
                {item.icon}
                <div>
                  <p className="text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Business Profile Form Modal */}
      {showBusinessProfileForm && (
        <BusinessProfileForm
          onClose={() => setShowBusinessProfileForm(false)}
          onSave={() => {
            setShowBusinessProfileForm(false)
            // The BusinessProfileCard will automatically refresh
          }}
        />
      )}
    </Page>
  )
}
