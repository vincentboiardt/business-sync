'use client'

import { useState } from 'react'
import { Button, Card, LoadingSpinner } from '~/components'
import { BusinessProfileForm } from '~/components/business-profile/BusinessProfileForm'
import { useBusinessProfile } from '~/hooks/useBusinessProfile'
import { DAYS_OF_WEEK } from '~/types/business'
import { Edit, MapPin, Phone, Globe, Clock } from 'lucide-react'

export function BusinessProfileCard() {
  const { profile, loading, error, refetch } = useBusinessProfile()
  const [showForm, setShowForm] = useState(false)

  const handleProfileSave = () => {
    // The hook will automatically update, but we can trigger a refetch to be sure
    refetch()
  }

  if (loading) {
    return (
      <Card title="Business Profile">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Business Profile">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card
        title={
          <>
            <h2 className="text-xl font-semibold">Business Profile</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </>
        }
      >
        {profile ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile.business_name}
              </h3>
              {profile.address && (
                <div className="flex items-start mt-2 text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{profile.address}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {profile.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}

              {profile.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand hover:text-brand/80 truncate"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {profile.opening_hours &&
              Object.keys(profile.opening_hours).length > 0 && (
                <div className="pt-4">
                  <div className="flex items-start text-gray-600">
                    <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">Opening Hours</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                        {DAYS_OF_WEEK.map((day) => {
                          const dayHours = profile.opening_hours?.[day]
                          const today = new Date().getDay()
                          const todayIndex = today === 0 ? 6 : today - 1
                          const dayIndex = DAYS_OF_WEEK.indexOf(day)
                          const isToday = dayIndex === todayIndex

                          return (
                            <div
                              key={day}
                              className={`flex justify-between ${
                                isToday ? 'font-semibold' : 'text-gray-600'
                              }`}
                            >
                              <span className="capitalize w-16">
                                {day.slice(0, 3)}
                              </span>
                              <span className="text-right">
                                {dayHours &&
                                !dayHours.toLowerCase().includes('closed')
                                  ? dayHours
                                  : 'Closed'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {profile.updated_at && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated:{' '}
                  {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No business profile found.</p>
            <Button onClick={() => setShowForm(true)}>
              Create Business Profile
            </Button>
          </div>
        )}
      </Card>

      {showForm && (
        <BusinessProfileForm
          onClose={() => setShowForm(false)}
          onSave={handleProfileSave}
        />
      )}
    </>
  )
}
