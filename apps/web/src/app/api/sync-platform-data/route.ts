import { NextResponse } from 'next/server'
import { createServerClientForRoute } from '@repo/supabase/server'
import {
  searchBusinessesOnPlatform,
  isPlatformSupported,
} from '@repo/platforms'

// Helper function to get API keys from environment variables
function getApiKeyForPlatform(platformName: string): string | undefined {
  const envMap: Record<string, string> = {
    google_business: 'GOOGLE_PLACES_API_KEY',
    yelp: 'YELP_API_KEY',
    bing_places: 'BING_MAPS_API_KEY',
    apple_maps: 'APPLE_MAPKIT_JWT',
    facebook: 'FACEBOOK_ACCESS_TOKEN',
  }

  const envVarName = envMap[platformName]
  return envVarName ? process.env[envVarName] : undefined
}

export async function POST(request: Request) {
  const supabase = await createServerClientForRoute()

  try {
    const { platform_name } = await request.json()

    if (!platform_name || !isPlatformSupported(platform_name)) {
      return NextResponse.json(
        { error: `Unsupported or missing platform: ${platform_name}` },
        { status: 400 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's business profile to create search query
    const { data: businessProfile, error: profileError } = await supabase
      .from('business_profiles')
      .select('business_name, address')
      .eq('user_id', user.id)
      .single()

    if (profileError || !businessProfile?.business_name) {
      return NextResponse.json(
        {
          error:
            'Business profile not found. Please set up your business information first.',
        },
        { status: 400 }
      )
    }

    // Create search query from business name and address
    const searchQuery = businessProfile.address
      ? `${businessProfile.business_name} ${businessProfile.address}`
      : businessProfile.business_name

    // Get API key from environment variables (since we're no longer using OAuth)
    const apiKey = getApiKeyForPlatform(platform_name)

    if (!apiKey) {
      return NextResponse.json(
        {
          error: `${platform_name} API key not configured. Please contact administrator.`,
        },
        { status: 401 }
      )
    }

    try {
      // Search for business information using the platform
      const searchResults = await searchBusinessesOnPlatform(
        platform_name,
        { query: searchQuery, limit: 10 },
        apiKey
      )

      if (!searchResults || searchResults.length === 0) {
        // Log the search attempt
        await supabase.from('sync_logs').insert({
          user_id: user.id,
          platform_name,
          sync_type: 'search',
          status: 'no_results',
          message: `No business found for query: "${searchQuery}"`,
          data: { searchQuery },
        })

        return NextResponse.json(
          {
            error: `No business found on ${platform_name} for "${searchQuery}"`,
          },
          { status: 404 }
        )
      }

      // Store all search results in the database
      const searchResultsData = searchResults.map((result) => ({
        user_id: user.id,
        platform_name,
        search_query: searchQuery,
        platform_business_id: result.platformId,
        business_name: result.businessName,
        address: result.address,
        phone: result.phone || null,
        website: result.website || null,
        rating: result.rating || null,
        review_count: result.reviewCount || null,
        category: result.category || null,
        latitude: result.coordinates?.latitude || null,
        longitude: result.coordinates?.longitude || null,
        opening_hours: result.openingHours || null,
        raw_data: result.rawData || null,
      }))

      // Use upsert to handle duplicates
      const { data: savedResults, error: saveError } = await supabase
        .from('platform_search_results')
        .upsert(searchResultsData, {
          onConflict: 'user_id,platform_name,platform_business_id',
          ignoreDuplicates: false,
        })
        .select()

      if (saveError) {
        console.error('Error saving search results:', saveError)
        return NextResponse.json(
          { error: 'Failed to save search results' },
          { status: 500 }
        )
      }

      // Log successful search
      await supabase.from('sync_logs').insert({
        user_id: user.id,
        platform_name,
        sync_type: 'search',
        status: 'success',
        message: `Found ${searchResults.length} business(es) for "${searchQuery}"`,
        data: {
          searchQuery,
          resultCount: searchResults.length,
          businesses: searchResults.map((r) => ({
            id: r.platformId,
            name: r.businessName,
          })),
        },
      })

      return NextResponse.json({
        success: true,
        message: `Found and saved ${searchResults.length} business result(s) from ${platform_name}`,
        searchQuery,
        resultCount: searchResults.length,
        results: savedResults,
      })
    } catch (searchError) {
      console.error(`Error searching ${platform_name}:`, searchError)

      const errorMessage =
        searchError instanceof Error ? searchError.message : String(searchError)

      // Log the error
      await supabase.from('sync_logs').insert({
        user_id: user.id,
        platform_name,
        sync_type: 'search',
        status: 'error',
        message: `Search failed: ${errorMessage}`,
        data: { searchQuery, error: errorMessage },
      })

      // Handle specific API errors
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          {
            error: `Invalid ${platform_name} API key. Please check your API configuration.`,
          },
          { status: 401 }
        )
      }

      if (
        errorMessage.includes('rate limit') ||
        errorMessage.includes('quota')
      ) {
        return NextResponse.json(
          {
            error: `${platform_name} API rate limit exceeded. Please try again later.`,
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          error: `Failed to search ${platform_name}: ${errorMessage}`,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in sync platform data API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
