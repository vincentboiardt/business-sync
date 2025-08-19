import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@repo/supabase/client'
import {
  BusinessProfile,
  BusinessProfileFormData,
  businessProfileSchema,
} from '~/types/business'

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        // Use safeParse to handle incomplete profiles gracefully
        const parseResult = businessProfileSchema.safeParse(data)
        if (parseResult.success) {
          setProfile(parseResult.data)
        } else {
          // If validation fails, still set the data but log the issues
          console.warn(
            'Profile data validation issues:',
            parseResult.error.issues
          )
          setProfile(data as BusinessProfile)
        }
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load business profile'
      )
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const saveProfile = useCallback(
    async (profileData: BusinessProfileFormData) => {
      try {
        setError(null)

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('User not authenticated')
        }

        // Prepare data for database - just add user_id
        const dataToSave = {
          ...profileData,
          user_id: user.id,
        }

        // Use upsert to handle both insert and update cases
        const { data, error } = await supabase
          .from('business_profiles')
          .upsert(dataToSave, {
            onConflict: 'user_id',
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        // Validate and set the saved profile using safeParse
        const parseResult = businessProfileSchema.safeParse(data)
        if (parseResult.success) {
          setProfile(parseResult.data)
          return parseResult.data
        } else {
          // If validation fails, still return the data but log the issues
          console.warn(
            'Saved profile validation issues:',
            parseResult.error.issues
          )
          const validatedProfile = data as BusinessProfile
          setProfile(validatedProfile)
          return validatedProfile
        }
      } catch (err) {
        console.error('Error saving profile:', err)
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save business profile'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    [supabase]
  )

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return {
    profile,
    loading,
    error,
    refetch: loadProfile,
    save: saveProfile,
  }
}
