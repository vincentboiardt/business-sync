import type { BusinessProfile, BusinessSearchQuery } from '~/types'

// Google Places API types
interface GooglePlaceSearchResult {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  types?: string[]
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  opening_hours?: {
    weekday_text?: string[]
    open_now?: boolean
  }
  business_status?: string
}

interface GooglePlacesSearchResponse {
  results: GooglePlaceSearchResult[]
  status: string
  error_message?: string
  next_page_token?: string
}

const GOOGLE_PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place'

/**
 * Search for businesses using Google Places Text Search API
 */
export async function searchGooglePlaces(
  searchQuery: BusinessSearchQuery,
  apiKey: string
): Promise<GooglePlaceSearchResult[]> {
  try {
    const url = new URL(`${GOOGLE_PLACES_API_BASE}/textsearch/json`)
    url.searchParams.set('query', searchQuery.query)
    url.searchParams.set('key', apiKey)

    if (searchQuery.limit) {
      // Google Places API doesn't have a direct limit parameter,
      // but we can control this in the response handling
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Google Places API HTTP error: ${response.status}`)
    }

    const data: GooglePlacesSearchResponse = await response.json()

    if (data.status !== 'OK') {
      throw new Error(
        `Google Places API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ''}`
      )
    }

    // Apply limit if specified
    let results = data.results
    if (searchQuery.limit && results.length > searchQuery.limit) {
      results = results.slice(0, searchQuery.limit)
    }

    return results
  } catch (error) {
    console.error('Failed to search Google Places:', error)
    throw error
  }
}

/**
 * Transform Google Place result to common BusinessProfile format
 */
export function transformFromGooglePlace(
  place: GooglePlaceSearchResult
): BusinessProfile {
  // Parse opening hours from weekday_text format
  const openingHours: Record<string, string> = {}
  if (place.opening_hours?.weekday_text) {
    place.opening_hours.weekday_text.forEach((dayText) => {
      const match = dayText.match(/^(\w+): (.+)$/)
      if (match) {
        const [, day, hours] = match
        openingHours[day.toLowerCase()] = hours === 'Closed' ? 'Closed' : hours
      }
    })
  }

  // Determine primary business category
  const category =
    place.types
      ?.find((type) => !['establishment', 'point_of_interest'].includes(type))
      ?.replace(/_/g, ' ') || 'Business'

  return {
    platformId: place.place_id,
    businessName: place.name,
    address: place.formatted_address,
    phone: place.formatted_phone_number,
    website: place.website,
    rating: place.rating,
    reviewCount: place.user_ratings_total,
    category,
    coordinates: place.geometry?.location
      ? {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        }
      : undefined,
    openingHours:
      Object.keys(openingHours).length > 0 ? openingHours : undefined,
    rawData: place,
  }
}
