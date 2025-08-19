import type {
  BusinessProfile,
  PlatformFetcher,
  BusinessSearchQuery,
} from '~/types'
import { searchGooglePlaces, transformFromGooglePlace } from './utils'

/**
 * Search for businesses using Google Places API
 */
async function searchBusinesses(
  searchQuery: BusinessSearchQuery,
  apiKey?: string
): Promise<BusinessProfile[]> {
  if (!apiKey) {
    throw new Error('Google Places API key is required')
  }

  try {
    const places = await searchGooglePlaces(searchQuery, apiKey)
    return places.map(transformFromGooglePlace)
  } catch (error) {
    console.error('Error searching Google Places:', error)
    throw new Error(
      'Failed to search Google Places. Please check your API key and search query.'
    )
  }
}

export const googleBusinessFetcher: PlatformFetcher = {
  searchBusinesses,
}
