import { NextResponse } from 'next/server'
import { createServerClientForRoute } from '@repo/supabase/server'
import { getGoogleBusinessLocations } from '~/lib/google-business'

export async function POST() {
  const supabase = await createServerClientForRoute()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    } // Get the user's access token for Google Business from the database
    // In a production app, you would retrieve the actual access token from your database
    // where it's stored after OAuth authentication
    const { data: connection } = await supabase
      .from('platform_connections')
      .select('access_token')
      .eq('user_id', user.id)
      .eq('platform_name', 'google_business')
      .eq('is_active', true)
      .single()

    const accessToken = connection?.access_token

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            'Google access token not found. Please connect your Google Business account first.',
        },
        { status: 401 }
      )
    }

    try {
      // Fetch business locations from Google Business API
      const locations = await getGoogleBusinessLocations(accessToken)

      if (!locations || locations.length === 0) {
        return NextResponse.json(
          { error: 'No Google Business locations found' },
          { status: 404 }
        )
      }

      // Use the first location for now
      const primaryLocation = locations[0]

      // Format address
      const address = [
        ...primaryLocation.address.addressLines,
        primaryLocation.address.locality,
        primaryLocation.address.administrativeArea,
        primaryLocation.address.postalCode,
      ]
        .filter(Boolean)
        .join(', ')

      // Format opening hours
      const openingHours: Record<string, string> = {}
      if (primaryLocation.regularHours?.periods) {
        primaryLocation.regularHours.periods.forEach((period) => {
          const day = period.openDay.toLowerCase()
          openingHours[day] = `${period.openTime} - ${period.closeTime}`
        })
      }

      // Upsert business profile in database
      const { data: profile, error } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          business_name: primaryLocation.locationName,
          address: address,
          phone: primaryLocation.primaryPhone,
          website: primaryLocation.websiteUri,
          opening_hours: openingHours,
          google_business_id: primaryLocation.name,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving business profile:', error)
        return NextResponse.json(
          { error: 'Failed to save business profile' },
          { status: 500 }
        )
      }

      // Update or create platform connection for Google Business
      await supabase.from('platform_connections').upsert({
        user_id: user.id,
        platform_name: 'google_business',
        platform_id: primaryLocation.name,
        access_token: accessToken, // Store the real access token securely
        is_active: true,
        updated_at: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message:
          'Business information synced successfully from Google Business',
        profile: {
          business_name: profile.business_name,
          address: profile.address,
          phone: profile.phone,
          website: profile.website,
          opening_hours: profile.opening_hours,
        },
      })
    } catch (apiError) {
      console.error('Error fetching from Google Business API:', apiError)

      const errorMessage = (apiError as Error).message

      // Handle specific Google API errors
      if (errorMessage.includes('Authentication failed')) {
        // Clear the invalid token
        await supabase
          .from('platform_connections')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('platform_name', 'google_business')

        return NextResponse.json(
          {
            error:
              'Google authentication expired. Please reconnect your Google Business account.',
          },
          { status: 401 }
        )
      }

      if (errorMessage.includes('Insufficient permissions')) {
        return NextResponse.json(
          {
            error:
              'Insufficient permissions to access Google Business Profile. Please ensure you have the necessary permissions and reconnect.',
          },
          { status: 403 }
        )
      }

      return NextResponse.json(
        {
          error: `Failed to fetch business information from Google Business: ${errorMessage}`,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in sync Google Business API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
