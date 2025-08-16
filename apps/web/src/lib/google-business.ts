// Google My Business API utilities
import { google } from 'googleapis'
import type { mybusinessbusinessinformation_v1 } from 'googleapis'

type TimeOfDay = mybusinessbusinessinformation_v1.Schema$TimeOfDay

export interface GoogleBusinessLocation {
  name: string
  locationName: string
  primaryPhone: string
  websiteUri: string
  regularHours: {
    periods: Array<{
      openDay: string
      openTime: string
      closeDay: string
      closeTime: string
    }>
  }
  address: {
    addressLines: string[]
    locality: string
    administrativeArea: string
    postalCode: string
    countryCode: string
  }
}

/**
 * Fetches all Google Business Profile locations for the authenticated user
 *
 * @param accessToken - OAuth 2.0 access token with Google My Business permissions
 * @returns Promise resolving to an array of business locations
 * @throws Error if authentication fails, permissions are insufficient, or API call fails
 *
 * @example
 * ```typescript
 * const locations = await getGoogleBusinessLocations(accessToken)
 * console.log(`Found ${locations.length} business locations`)
 * ```
 */
export async function getGoogleBusinessLocations(
  accessToken: string
): Promise<any[]> {
  try {
    // Create OAuth2 client with the access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    // For Google My Business API, we need to use the accounts.locations pattern
    // First, we need to get the account information
    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
      version: 'v1',
      auth: oauth2Client,
      retryConfig: {
        retry: 0,
      },
    })

    // Get accounts first
    const accountsResponse = await mybusinessaccountmanagement.accounts.list()
    const accounts = accountsResponse.data.accounts || []
    console.log('will try', accountsResponse.data.accounts)

    if (accounts.length === 0) {
      throw new Error('No Google Business accounts found')
    }

    // Initialize the business information API
    /*const mybusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: oauth2Client,
    })

    const businessLocations: GoogleBusinessLocation[] = []

    // For each account, get its locations
    for (const account of accounts) {
      if (!account.name) continue

      try {
        // Use the correct endpoint pattern: accounts/{account}/locations
        const locationsResponse = await mybusiness.accounts.locations.list({
          parent: account.name,
          readMask:
            'name,title,phoneNumbers,websiteUri,regularHours,storefrontAddress',
        })

        const locations = locationsResponse.data.locations || []

        for (const location of locations) {
          if (!location.name) continue

          // Helper function to format time
          const formatTime = (
            timeOfDay: TimeOfDay | string | undefined
          ): string => {
            if (typeof timeOfDay === 'string') return timeOfDay
            if (timeOfDay && typeof timeOfDay === 'object') {
              const hours = String(timeOfDay.hours || 0).padStart(2, '0')
              const minutes = String(timeOfDay.minutes || 0).padStart(2, '0')
              return `${hours}:${minutes}`
            }
            return ''
          }

          // Transform the API response to our interface
          const businessLocation: GoogleBusinessLocation = {
            name: location.name,
            locationName:
              location.title || location.name.split('/').pop() || '',
            primaryPhone: location.phoneNumbers?.primaryPhone || '',
            websiteUri: location.websiteUri || '',
            regularHours: {
              periods:
                location.regularHours?.periods?.map(
                  (
                    period: mybusinessbusinessinformation_v1.Schema$TimePeriod
                  ) => ({
                    openDay: period.openDay || '',
                    openTime: formatTime(period.openTime),
                    closeDay: period.closeDay || '',
                    closeTime: formatTime(period.closeTime),
                  })
                ) || [],
            },
            address: {
              addressLines: location.storefrontAddress?.addressLines || [],
              locality: location.storefrontAddress?.locality || '',
              administrativeArea:
                location.storefrontAddress?.administrativeArea || '',
              postalCode: location.storefrontAddress?.postalCode || '',
              countryCode: location.storefrontAddress?.regionCode || '',
            },
          }

          businessLocations.push(businessLocation)
        }
      } catch (error) {
        console.error(
          `Error fetching locations for account ${account.name}:`,
          error
        )
        // Continue with other accounts
      }
    }

    return businessLocations*/
    return accounts
  } catch (error) {
    console.error('Error fetching Google Business locations:', error)

    // Check if it's an authentication error
    const googleError = error as { code?: number; message?: string }
    if (googleError.code === 401) {
      throw new Error(
        'Authentication failed. Please reconnect your Google account.'
      )
    }

    // Check if it's a permissions error
    if (googleError.code === 403) {
      throw new Error(
        'Insufficient permissions to access Google Business Profile. Please ensure you have the necessary permissions.'
      )
    }

    throw new Error(
      `Failed to fetch business locations: ${googleError.message || 'Unknown error'}`
    )
  }
}

/**
 * Updates a Google Business Profile location with new information
 *
 * @param accessToken - OAuth 2.0 access token with Google My Business permissions
 * @param locationName - The Google resource name of the location (e.g., "accounts/123/locations/456")
 * @param updateData - Partial location data to update
 * @returns Promise resolving to the updated location data
 * @throws Error if location not found, permissions insufficient, or update fails
 *
 * @example
 * ```typescript
 * const updated = await updateGoogleBusinessLocation(
 *   accessToken,
 *   'accounts/123/locations/456',
 *   { locationName: 'New Business Name', primaryPhone: '+1-555-123-4567' }
 * )
 * ```
 */
export async function updateGoogleBusinessLocation(
  accessToken: string,
  locationName: string,
  updateData: Partial<GoogleBusinessLocation>
): Promise<GoogleBusinessLocation> {
  try {
    // Create OAuth2 client with the access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    // Initialize the Google My Business API client
    const mybusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: oauth2Client,
    })

    // Helper function to convert time string to TimeOfDay object
    const parseTime = (timeStr: string): TimeOfDay | undefined => {
      if (!timeStr) return undefined
      const [hours, minutes] = timeStr.split(':').map(Number)
      return { hours, minutes }
    }

    // Prepare the update request body
    const updateMask: string[] = []
    const requestBody: mybusinessbusinessinformation_v1.Schema$Location = {}

    if (updateData.locationName) {
      requestBody.title = updateData.locationName
      updateMask.push('title')
    }

    if (updateData.primaryPhone) {
      requestBody.phoneNumbers = {
        primaryPhone: updateData.primaryPhone,
      }
      updateMask.push('phoneNumbers')
    }

    if (updateData.websiteUri) {
      requestBody.websiteUri = updateData.websiteUri
      updateMask.push('websiteUri')
    }

    if (updateData.regularHours) {
      requestBody.regularHours = {
        periods: updateData.regularHours.periods.map((period) => ({
          openDay: period.openDay,
          openTime: parseTime(period.openTime),
          closeDay: period.closeDay,
          closeTime: parseTime(period.closeTime),
        })),
      }
      updateMask.push('regularHours')
    }

    if (updateData.address) {
      requestBody.storefrontAddress = {
        addressLines: updateData.address.addressLines,
        locality: updateData.address.locality,
        administrativeArea: updateData.address.administrativeArea,
        postalCode: updateData.address.postalCode,
        regionCode: updateData.address.countryCode,
      }
      updateMask.push('storefrontAddress')
    }

    // Perform the update
    const response = await mybusiness.locations.patch({
      name: locationName,
      updateMask: updateMask.join(','),
      requestBody,
    })

    const location = response.data
    if (!location) {
      throw new Error('No location data returned from update')
    }

    // Helper function to format time for response
    const formatTime = (timeOfDay: TimeOfDay | string | undefined): string => {
      if (typeof timeOfDay === 'string') return timeOfDay
      if (timeOfDay && typeof timeOfDay === 'object') {
        const hours = String(timeOfDay.hours || 0).padStart(2, '0')
        const minutes = String(timeOfDay.minutes || 0).padStart(2, '0')
        return `${hours}:${minutes}`
      }
      return ''
    }

    // Return the updated location in our interface format
    return {
      name: location.name || locationName,
      locationName: location.title || '',
      primaryPhone: location.phoneNumbers?.primaryPhone || '',
      websiteUri: location.websiteUri || '',
      regularHours: {
        periods:
          location.regularHours?.periods?.map(
            (period: mybusinessbusinessinformation_v1.Schema$TimePeriod) => ({
              openDay: period.openDay || '',
              openTime: formatTime(period.openTime),
              closeDay: period.closeDay || '',
              closeTime: formatTime(period.closeTime),
            })
          ) || [],
      },
      address: {
        addressLines: location.storefrontAddress?.addressLines || [],
        locality: location.storefrontAddress?.locality || '',
        administrativeArea:
          location.storefrontAddress?.administrativeArea || '',
        postalCode: location.storefrontAddress?.postalCode || '',
        countryCode: location.storefrontAddress?.regionCode || '',
      },
    }
  } catch (error) {
    console.error('Error updating Google Business location:', error)

    // Check for specific error types
    const googleError = error as { code?: number; message?: string }
    if (googleError.code === 401) {
      throw new Error(
        'Authentication failed. Please reconnect your Google account.'
      )
    }

    if (googleError.code === 403) {
      throw new Error(
        'Insufficient permissions to update Google Business Profile.'
      )
    }

    if (googleError.code === 404) {
      throw new Error('Location not found. Please check the location name.')
    }

    throw new Error(
      `Failed to update business location: ${googleError.message || 'Unknown error'}`
    )
  }
}

/**
 * Get a specific Google Business location by name
 */
export async function getGoogleBusinessLocation(
  accessToken: string,
  locationName: string
): Promise<GoogleBusinessLocation | null> {
  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    const mybusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: oauth2Client,
    })

    const response = await mybusiness.locations.get({
      name: locationName,
      readMask:
        'name,title,phoneNumbers,websiteUri,regularHours,storefrontAddress',
    })

    const location = response.data
    if (!location?.name) return null

    // Helper function to format time
    const formatTime = (timeOfDay: TimeOfDay | string | undefined): string => {
      if (typeof timeOfDay === 'string') return timeOfDay
      if (timeOfDay && typeof timeOfDay === 'object') {
        const hours = String(timeOfDay.hours || 0).padStart(2, '0')
        const minutes = String(timeOfDay.minutes || 0).padStart(2, '0')
        return `${hours}:${minutes}`
      }
      return ''
    }

    return {
      name: location.name,
      locationName: location.title || '',
      primaryPhone: location.phoneNumbers?.primaryPhone || '',
      websiteUri: location.websiteUri || '',
      regularHours: {
        periods:
          location.regularHours?.periods?.map(
            (period: mybusinessbusinessinformation_v1.Schema$TimePeriod) => ({
              openDay: period.openDay || '',
              openTime: formatTime(period.openTime),
              closeDay: period.closeDay || '',
              closeTime: formatTime(period.closeTime),
            })
          ) || [],
      },
      address: {
        addressLines: location.storefrontAddress?.addressLines || [],
        locality: location.storefrontAddress?.locality || '',
        administrativeArea:
          location.storefrontAddress?.administrativeArea || '',
        postalCode: location.storefrontAddress?.postalCode || '',
        countryCode: location.storefrontAddress?.regionCode || '',
      },
    }
  } catch (error) {
    console.error(`Error fetching location ${locationName}:`, error)
    return null
  }
}

/**
 * Check if the access token has the necessary permissions for Google My Business
 */
export async function checkGoogleBusinessPermissions(
  accessToken: string
): Promise<boolean> {
  try {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
      version: 'v1',
      auth: oauth2Client,
    })

    // Try to list accounts to check permissions
    await mybusinessaccountmanagement.accounts.list()
    return true
  } catch (error) {
    console.error('Permission check failed:', error)
    return false
  }
}
