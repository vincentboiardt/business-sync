import type { BusinessProfile, BusinessSearchQuery } from '~/types'

// Apple MapKit JS API types for search
interface AppleMapsSearchResult {
  id?: string
  name: string
  formattedAddress: string
  coordinate: {
    latitude: number
    longitude: number
  }
  phoneNumber?: string
  url?: string
  category?: string
  region?: {
    center: {
      latitude: number
      longitude: number
    }
    span: {
      latitudeDelta: number
      longitudeDelta: number
    }
  }
}

interface AppleMapsSearchResponse {
  results: AppleMapsSearchResult[]
  displayRegion?: {
    center: {
      latitude: number
      longitude: number
    }
    span: {
      latitudeDelta: number
      longitudeDelta: number
    }
  }
}

/**
 * Search for businesses using Apple MapKit JS API
 * Note: Apple MapKit requires JWT token and is typically used client-side
 */
export async function searchAppleMaps(
  searchQuery: BusinessSearchQuery,
  apiKey: string
): Promise<AppleMapsSearchResult[]> {
  try {
    // Note: This is a simplified example. Real Apple MapKit JS implementation
    // would require proper JWT token generation and client-side usage
    const url = new URL('https://api.mapkit.apple.com/v1/search')
    url.searchParams.set('q', searchQuery.query)
    url.searchParams.set('resultTypeFilter', 'PointOfInterest')

    if (searchQuery.limit) {
      url.searchParams.set('limit', Math.min(searchQuery.limit, 50).toString())
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Apple MapKit API HTTP error: ${response.status}`)
    }

    const data: AppleMapsSearchResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Failed to search Apple Maps:', error)
    throw error
  }
}

/**
 * Transform Apple Maps search result to common BusinessProfile format
 */
export function transformFromApplePlace(
  place: AppleMapsSearchResult
): BusinessProfile {
  // Generate a unique platform ID
  const platformId =
    place.id ||
    `apple_${place.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`

  return {
    platformId,
    businessName: place.name,
    address: place.formattedAddress,
    phone: place.phoneNumber,
    website: place.url,
    category: place.category || 'Business',
    coordinates: {
      latitude: place.coordinate.latitude,
      longitude: place.coordinate.longitude,
    },
    rawData: place,
  }
}
