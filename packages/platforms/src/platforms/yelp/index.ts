import type {
  BusinessProfile,
  PlatformFetcher,
  BusinessSearchQuery,
} from '~/types/business'

// Yelp Business API response structure
interface YelpBusiness {
  id: string
  name: string
  phone: string
  display_phone: string
  url: string
  image_url?: string
  is_closed: boolean
  rating: number
  review_count: number
  categories: Array<{
    alias: string
    title: string
  }>
  location: {
    address1: string
    address2?: string
    address3?: string
    city: string
    state: string
    zip_code: string
    country: string
    display_address: string[]
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  hours?: Array<{
    hours_type: string
    is_open_now: boolean
    open: Array<{
      day: number // 0=Monday, 1=Tuesday, etc.
      start: string // "0900"
      end: string // "1700"
    }>
  }>
  price?: string // "$", "$$", "$$$", "$$$$"
}

interface YelpSearchResponse {
  businesses: YelpBusiness[]
  total: number
  region: {
    center: {
      latitude: number
      longitude: number
    }
  }
}

/**
 * Search for businesses using Yelp Fusion API
 */
async function searchYelpBusinesses(
  searchQuery: BusinessSearchQuery,
  apiKey: string
): Promise<YelpBusiness[]> {
  try {
    const url = new URL('https://api.yelp.com/v3/businesses/search')
    url.searchParams.set('term', searchQuery.query)

    if (searchQuery.limit) {
      url.searchParams.set('limit', Math.min(searchQuery.limit, 50).toString())
    } else {
      url.searchParams.set('limit', '20')
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Yelp API HTTP error: ${response.status}`)
    }

    const data: YelpSearchResponse = await response.json()
    return data.businesses || []
  } catch (error) {
    console.error('Failed to search Yelp businesses:', error)
    throw error
  }
}

/**
 * Transform Yelp business data to common BusinessProfile format
 */
function transformFromYelpBusiness(business: YelpBusiness): BusinessProfile {
  // Format address
  const address = business.location.display_address.join(', ')

  // Format opening hours
  const openingHours: Record<string, string> = {}
  if (business.hours && business.hours[0]?.open) {
    const dayNames = [
      'monday', // 0
      'tuesday', // 1
      'wednesday', // 2
      'thursday', // 3
      'friday', // 4
      'saturday', // 5
      'sunday', // 6
    ]

    business.hours[0].open.forEach((period) => {
      const dayName = dayNames[period.day]
      if (dayName) {
        // Convert "0900" to "09:00" format
        const startTime = `${period.start.slice(0, 2)}:${period.start.slice(2)}`
        const endTime = `${period.end.slice(0, 2)}:${period.end.slice(2)}`
        openingHours[dayName] = `${startTime} - ${endTime}`
      }
    })
  }

  // Get primary business category
  const category = business.categories?.[0]?.title || 'Business'

  return {
    platformId: business.id,
    businessName: business.name,
    address,
    phone: business.display_phone || business.phone,
    website: business.url,
    rating: business.rating,
    reviewCount: business.review_count,
    category,
    coordinates: {
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude,
    },
    openingHours:
      Object.keys(openingHours).length > 0 ? openingHours : undefined,
    rawData: business,
  }
}

/**
 * Search for businesses using Yelp Fusion API
 */
async function searchBusinesses(
  searchQuery: BusinessSearchQuery,
  apiKey?: string
): Promise<BusinessProfile[]> {
  if (!apiKey) {
    throw new Error('Yelp API key is required')
  }

  try {
    const businesses = await searchYelpBusinesses(searchQuery, apiKey)
    return businesses.map(transformFromYelpBusiness)
  } catch (error) {
    console.error('Error searching Yelp businesses:', error)
    throw new Error(
      'Failed to search Yelp businesses. Please check your API key and search query.'
    )
  }
}

export const yelpFetcher: PlatformFetcher = {
  searchBusinesses,
}
