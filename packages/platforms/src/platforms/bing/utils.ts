import type { BusinessProfile, BusinessSearchQuery } from '~/types'

// Bing Maps API types
interface BingMapsLocation {
  id?: string
  name: string
  entityType: string
  address: {
    addressLine?: string
    locality?: string
    adminDistrict?: string
    postalCode?: string
    countryRegion?: string
    formattedAddress?: string
  }
  point?: {
    coordinates: [number, number] // [latitude, longitude]
  }
  phoneNumber?: string
  website?: string
  confidence?: 'High' | 'Medium' | 'Low'
  bbox?: number[]
}

// Bing Maps API search response
interface BingMapsSearchResponse {
  authenticationResultCode: string
  brandLogoUri: string
  copyright: string
  resourceSets: Array<{
    estimatedTotal: number
    resources: BingMapsLocation[]
  }>
  statusCode: number
  statusDescription: string
  traceId: string
}

export const BING_MAPS_API_BASE = 'https://dev.virtualearth.net/REST/v1'

/**
 * Search for businesses using Bing Maps Local Search API
 */
export async function searchBingPlaces(
  searchQuery: BusinessSearchQuery,
  apiKey: string
): Promise<BingMapsLocation[]> {
  try {
    const url = new URL(`${BING_MAPS_API_BASE}/LocalSearch`)
    url.searchParams.set('query', searchQuery.query)
    url.searchParams.set('key', apiKey)

    // Set result limit if specified
    if (searchQuery.limit) {
      url.searchParams.set(
        'maxResults',
        Math.min(searchQuery.limit, 25).toString()
      )
    } else {
      url.searchParams.set('maxResults', '20')
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Bing Maps API HTTP error: ${response.status}`)
    }

    const data: BingMapsSearchResponse = await response.json()

    if (data.statusCode !== 200) {
      throw new Error(
        `Bing Maps API error: ${data.statusCode} - ${data.statusDescription}`
      )
    }

    return data.resourceSets[0]?.resources || []
  } catch (error) {
    console.error('Failed to search Bing Maps:', error)
    throw error
  }
}

/**
 * Transform Bing Maps location data to common BusinessProfile format
 */
export function transformFromBingPlace(
  location: BingMapsLocation
): BusinessProfile {
  // Format address
  const addressParts = [
    location.address.addressLine,
    location.address.locality,
    location.address.adminDistrict,
    location.address.postalCode,
    location.address.countryRegion,
  ].filter(Boolean)

  const address = location.address.formattedAddress || addressParts.join(', ')

  // Generate a unique platform ID (Bing doesn't always provide one)
  const platformId =
    location.id ||
    `bing_${location.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`

  // Determine business category from entity type
  const category =
    location.entityType === 'Business' ? 'Business' : location.entityType

  return {
    platformId,
    businessName: location.name,
    address,
    phone: location.phoneNumber,
    website: location.website,
    category,
    coordinates: location.point?.coordinates
      ? {
          latitude: location.point.coordinates[0],
          longitude: location.point.coordinates[1],
        }
      : undefined,
    rawData: location,
  }
}
