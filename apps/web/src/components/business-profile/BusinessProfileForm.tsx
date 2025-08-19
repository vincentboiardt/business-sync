'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBusinessProfile } from '~/hooks/useBusinessProfile'
import {
  BusinessProfile,
  BusinessProfileFormData,
  businessProfileFormSchema,
  parseOpeningHours,
  formatOpeningHours,
} from '~/types/business'
import { Save } from 'lucide-react'
import {
  FormError,
  FormActions,
  BusinessProfileFields,
  OpeningHoursField,
} from '~/components/form'
import { Modal } from '~/components'
import { LoadingSpinner } from '../LoadingSpinner'

interface BusinessProfileFormProps {
  onClose: () => void
  onSave?: (profile: BusinessProfile) => void
}

export function BusinessProfileForm({
  onClose,
  onSave,
}: BusinessProfileFormProps) {
  const {
    profile: existingProfile,
    loading,
    save,
    error: hookError,
  } = useBusinessProfile()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileFormSchema),
    defaultValues: {
      business_name: '',
      address: '',
      phone: '',
      website: '',
      opening_hours: {},
    },
  })

  // Watch opening_hours to handle dynamic updates
  const openingHours = watch('opening_hours')

  // Load existing profile data into form
  useEffect(() => {
    setSubmitError(null) // Clear any previous errors
    if (existingProfile) {
      reset({
        business_name: existingProfile.business_name || '', // Handle incomplete profiles
        address: existingProfile.address || '',
        phone: existingProfile.phone || '',
        website: existingProfile.website || '',
        opening_hours: existingProfile.opening_hours || {},
      })
    }
  }, [existingProfile, reset])

  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      setSubmitError(null)
      const savedProfile = await save(data)
      onSave?.(savedProfile)
      onClose()
    } catch (err) {
      console.error('Form submission error:', err)
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to save business profile'
      )
    }
  }

  const handleTimeChange = (
    day: string,
    timeType: 'open' | 'close',
    timeValue: string
  ) => {
    const currentHours = openingHours?.[day] || ''
    const parsedHours = parseOpeningHours(currentHours)

    if (timeType === 'open') {
      const closeTime = parsedHours?.close || '17:00'
      const newValue = formatOpeningHours(timeValue, closeTime)
      setValue(`opening_hours.${day}`, newValue, { shouldValidate: true })
    } else {
      const openTime = parsedHours?.open || '09:00'
      const newValue = formatOpeningHours(openTime, timeValue)
      setValue(`opening_hours.${day}`, newValue, { shouldValidate: true })
    }
  }

  const handleClosedToggle = (day: string, isClosed: boolean) => {
    if (isClosed) {
      setValue(`opening_hours.${day}`, 'Closed', { shouldValidate: true })
    } else {
      // Set default hours
      setValue(`opening_hours.${day}`, formatOpeningHours('09:00', '17:00'), {
        shouldValidate: true,
      })
    }
  }

  if (loading) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        title="Loading..."
        showCloseButton={false}
      >
        <LoadingSpinner />
      </Modal>
    )
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Business Profile">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Display */}
        {(submitError || hookError) && (
          <FormError
            title="Error saving business profile"
            message={submitError || hookError || ''}
          />
        )}

        {/* Basic Information */}
        <BusinessProfileFields register={register} errors={errors} />

        {/* Opening Hours */}
        <OpeningHoursField
          openingHours={openingHours || {}}
          onTimeChange={handleTimeChange}
          onClosedToggle={handleClosedToggle}
          error={
            typeof errors.opening_hours?.message === 'string'
              ? errors.opening_hours.message
              : undefined
          }
        />

        {/* Actions */}
        <FormActions
          onCancel={onClose}
          submitText="Save Profile"
          submitIcon={<Save className="w-4 h-4" />}
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  )
}
