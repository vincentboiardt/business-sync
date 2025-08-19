import type {
  BusinessProfile,
  PlatformFetcher,
  BusinessSearchQuery,
} from '~/types'
import { searchFacebookPlaces, transformFromFacebookPlace } from './utils'

/**
 * Search for businesses using Facebook Places API
 */
async function searchBusinesses(
  searchQuery: BusinessSearchQuery,
  apiKey?: string
): Promise<BusinessProfile[]> {
  if (!apiKey) {
    throw new Error('Facebook API access token is required')
  }

  try {
    const places = await searchFacebookPlaces(searchQuery, apiKey)
    return places.map(transformFromFacebookPlace)
  } catch (error) {
    console.error('Error searching Facebook Places:', error)
    throw new Error(
      'Failed to search Facebook Places. Please check your access token and search query.'
    )
  }
}

export const facebookFetcher: PlatformFetcher = {
  searchBusinesses,
}
