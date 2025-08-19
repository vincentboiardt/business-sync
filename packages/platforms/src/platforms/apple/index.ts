import type {
  BusinessProfile,
  PlatformFetcher,
  BusinessSearchQuery,
} from '~/types'
import { searchAppleMaps, transformFromApplePlace } from './utils'

/**
 * Search for businesses using Apple Maps API
 */
async function searchBusinesses(
  searchQuery: BusinessSearchQuery,
  apiKey?: string
): Promise<BusinessProfile[]> {
  if (!apiKey) {
    throw new Error('Apple Maps API key is required')
  }

  try {
    const places = await searchAppleMaps(searchQuery, apiKey)
    return places.map(transformFromApplePlace)
  } catch (error) {
    console.error('Error searching Apple Maps:', error)
    throw new Error(
      'Failed to search Apple Maps. Please check your API key and search query.'
    )
  }
}

export const appleBusinessFetcher: PlatformFetcher = {
  searchBusinesses,
}
