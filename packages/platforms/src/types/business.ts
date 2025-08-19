/**
 * Common business profile structure used across all platforms
 */
export interface BusinessProfile {
  /** Unique identifier from the platform */
  platformId: string
  /** Business name/title */
  businessName: string
  /** Full formatted address */
  address: string
  /** Primary phone number */
  phone?: string
  /** Business website URL */
  website?: string
  /** Opening hours by day of week */
  openingHours?: Record<string, string>
  /** Business rating (if available) */
  rating?: number
  /** Number of reviews (if available) */
  reviewCount?: number
  /** Business category/type */
  category?: string
  /** Geographic coordinates */
  coordinates?: {
    latitude: number
    longitude: number
  }
  /** Raw platform-specific data for debugging/reference */
  rawData?: unknown
}

/**
 * Search query for finding business locations
 */
export interface BusinessSearchQuery {
  /** Concatenated string with business name and location */
  query: string
  /** Optional limit on number of results */
  limit?: number
}

/**
 * Platform connection information
 */
export interface PlatformConnection {
  userId: string
  platformName: string
  platformId: string
  accessToken: string
  isActive: boolean
  updatedAt: string
}

/**
 * Supported platform names
 */
export type SupportedPlatform =
  | 'google_business'
  | 'yelp'
  | 'bing_places'
  | 'apple_maps'
  | 'facebook'
  | 'tripadvisor'

/**
 * Platform fetcher interface for searching business information
 */
export interface PlatformFetcher {
  searchBusinesses: (
    searchQuery: BusinessSearchQuery,
    apiKey?: string
  ) => Promise<BusinessProfile[]>
}
