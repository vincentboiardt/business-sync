import type { BusinessProfile, BusinessSearchQuery } from '~/types'

// Facebook Places Search API types
interface FacebookPlace {
  id: string
  name: string
  category?: string
  location?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zip?: string
    latitude?: number
    longitude?: number
  }
  phone?: string
  website?: string
  hours?: {
    [key: string]: string // e.g., "mon_1_open": "09:00", "mon_1_close": "17:00"
  }
  about?: string
  description?: string
  rating?: {
    value: number
    scale: number
  }
  checkins?: number
  overall_star_rating?: number
  rating_count?: number
}

interface FacebookPlacesSearchResponse {
  data: FacebookPlace[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

export const FACEBOOK_GRAPH_API_BASE = 'https://graph.facebook.com/v18.0'

/**
 * Search for businesses using Facebook Places API
 */
export async function searchFacebookPlaces(
  searchQuery: BusinessSearchQuery,
  accessToken: string
): Promise<FacebookPlace[]> {
  try {
    const url = new URL(`${FACEBOOK_GRAPH_API_BASE}/search`)
    url.searchParams.set('q', searchQuery.query)
    url.searchParams.set('type', 'place')
    url.searchParams.set('access_token', accessToken)
    url.searchParams.set(
      'fields',
      'id,name,category,location,phone,website,hours,about,description,rating,checkins,overall_star_rating,rating_count'
    )

    if (searchQuery.limit) {
      url.searchParams.set('limit', Math.min(searchQuery.limit, 100).toString())
    } else {
      url.searchParams.set('limit', '25')
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Facebook Places API HTTP error: ${response.status}`)
    }

    const data: FacebookPlacesSearchResponse = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to search Facebook Places:', error)
    throw error
  }
}

/**
 * Transform Facebook Place result to common BusinessProfile format
 */
export function transformFromFacebookPlace(
  place: FacebookPlace
): BusinessProfile {
  // Format address from location components
  let address = ''
  if (place.location) {
    const addressParts = [
      place.location.street,
      place.location.city,
      place.location.state,
      place.location.zip,
      place.location.country,
    ].filter(Boolean)
    address = addressParts.join(', ')
  }

  // Transform Facebook hours format to our standard format
  const openingHours: Record<string, string> = {}
  if (place.hours) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    const dayNames = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]

    days.forEach((day, index) => {
      const openKey = `${day}_1_open`
      const closeKey = `${day}_1_close`

      if (place.hours![openKey] && place.hours![closeKey]) {
        openingHours[dayNames[index]] =
          `${place.hours![openKey]} - ${place.hours![closeKey]}`
      }
    })
  }

  // Get rating information
  let rating: number | undefined
  let reviewCount: number | undefined

  if (place.overall_star_rating) {
    rating = place.overall_star_rating
    reviewCount = place.rating_count
  } else if (place.rating) {
    rating = place.rating.value
  }

  return {
    platformId: place.id,
    businessName: place.name,
    address,
    phone: place.phone,
    website: place.website,
    rating,
    reviewCount,
    category: place.category || 'Business',
    coordinates:
      place.location?.latitude && place.location?.longitude
        ? {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          }
        : undefined,
    openingHours:
      Object.keys(openingHours).length > 0 ? openingHours : undefined,
    rawData: place,
  }
}
