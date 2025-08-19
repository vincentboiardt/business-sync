import type {
  PlatformFetcher,
  SupportedPlatform,
  BusinessSearchQuery,
  BusinessProfile,
} from '~/types'
import {
  googleBusinessFetcher,
  yelpFetcher,
  bingMapsFetcher,
  appleBusinessFetcher,
  facebookFetcher,
} from '~/platforms'

/**
 * Registry of platform fetchers
 */
const platformFetchers: Partial<Record<SupportedPlatform, PlatformFetcher>> = {
  google: googleBusinessFetcher,
  yelp: yelpFetcher,
  bing: bingMapsFetcher,
  apple_maps: appleBusinessFetcher,
  facebook: facebookFetcher,
  // tripadvisor: tripadvisorFetcher,
} as const

/**
 * Get a platform fetcher by name
 */
export function getPlatformFetcher(
  platform: SupportedPlatform
): PlatformFetcher {
  const fetcher = platformFetchers[platform]
  if (!fetcher) {
    throw new Error(`Unsupported platform: ${platform}`)
  }
  return fetcher
}

/**
 * Get all supported platform names
 */
export function getSupportedPlatforms(): SupportedPlatform[] {
  return Object.keys(platformFetchers) as SupportedPlatform[]
}

/**
 * Check if a platform is supported
 */
export function isPlatformSupported(
  platform: string
): platform is SupportedPlatform {
  return platform in platformFetchers
}

/**
 * Search for businesses across multiple platforms
 */
export async function searchBusinessesAcrossPlatforms(
  searchQuery: BusinessSearchQuery,
  platforms: SupportedPlatform[],
  apiKeys: Partial<Record<SupportedPlatform, string>>
): Promise<Record<SupportedPlatform, BusinessProfile[]>> {
  const results: Record<SupportedPlatform, BusinessProfile[]> = {} as Record<
    SupportedPlatform,
    BusinessProfile[]
  >

  await Promise.allSettled(
    platforms.map(async (platform) => {
      try {
        const fetcher = getPlatformFetcher(platform)
        const apiKey = apiKeys[platform]
        const businesses = await fetcher.searchBusinesses(searchQuery, apiKey)
        results[platform] = businesses
      } catch (error) {
        console.error(`Failed to search ${platform}:`, error)
        results[platform] = []
      }
    })
  )

  return results
}

/**
 * Search for businesses on a single platform
 */
export async function searchBusinessesOnPlatform(
  platform: SupportedPlatform,
  searchQuery: BusinessSearchQuery,
  apiKey?: string
): Promise<BusinessProfile[]> {
  const fetcher = getPlatformFetcher(platform)
  return await fetcher.searchBusinesses(searchQuery, apiKey)
}
