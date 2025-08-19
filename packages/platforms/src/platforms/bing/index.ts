import type {
  BusinessProfile,
  PlatformFetcher,
  BusinessSearchQuery,
} from '~/types'
import { searchBingPlaces, transformFromBingPlace } from './utils'

/**
 * Search for businesses using Bing Maps API
 */
async function searchBusinesses(
  searchQuery: BusinessSearchQuery,
  apiKey?: string
): Promise<BusinessProfile[]> {
  if (!apiKey) {
    throw new Error('Bing Maps API key is required')
  }

  try {
    const places = await searchBingPlaces(searchQuery, apiKey)
    return places.map(transformFromBingPlace)
  } catch (error) {
    console.error('Error searching Bing Maps:', error)
    throw new Error(
      'Failed to search Bing Maps. Please check your API key and search query.'
    )
  }
}

export const bingMapsFetcher: PlatformFetcher = {
  searchBusinesses,
}
