# Business Sync Platforms

This package provides a unified interface for searching business information across multiple platforms.

## Overview

The platform integrations are designed to search for business locations based on a concatenated string containing the business name and location. Each platform returns standardized business profile data.

## Usage

### Basic Search

```typescript
import { searchBusinessesOnPlatform } from '@business-sync/platforms'

// Search for "Joe's Pizza New York" on Google
const results = await searchBusinessesOnPlatform(
  'google_business',
  {
    query: "Joe's Pizza New York",
    limit: 10,
  },
  'your-google-api-key'
)

console.log(results) // Array of BusinessProfile objects
```

### Multi-Platform Search

```typescript
import { searchBusinessesAcrossPlatforms } from '@business-sync/platforms'

const results = await searchBusinessesAcrossPlatforms(
  {
    query: 'Starbucks Seattle WA',
    limit: 5,
  },
  ['google_business', 'yelp', 'facebook'],
  {
    google_business: 'your-google-api-key',
    yelp: 'your-yelp-api-key',
    facebook: 'your-facebook-access-token',
  }
)

console.log(results.google_business) // Google results
console.log(results.yelp) // Yelp results
console.log(results.facebook) // Facebook results
```

## Supported Platforms

### Google Business (Places API)

- **API**: Google Places Text Search API
- **Required**: Google Places API key
- **Features**: Ratings, reviews, opening hours, coordinates
- **Format**: `"Business Name Location"`

### Yelp

- **API**: Yelp Fusion API
- **Required**: Yelp API key
- **Features**: Ratings, reviews, price range, categories, coordinates
- **Format**: `"Business Name Location"`

### Bing Maps

- **API**: Bing Maps Local Search API
- **Required**: Bing Maps API key
- **Features**: Address, coordinates, phone numbers
- **Format**: `"Business Name Location"`

### Apple Maps

- **API**: Apple MapKit JS API
- **Required**: Apple MapKit JWT token
- **Features**: Coordinates, address, categories
- **Format**: `"Business Name Location"`
- **Note**: Typically used client-side

### Facebook Places

- **API**: Facebook Graph API Places Search
- **Required**: Facebook access token
- **Features**: Ratings, check-ins, categories, opening hours
- **Format**: `"Business Name Location"`

## Data Structure

All platforms return data in the standardized `BusinessProfile` format:

```typescript
interface BusinessProfile {
  platformId: string // Unique ID from the platform
  businessName: string // Business name
  address: string // Full formatted address
  phone?: string // Phone number
  website?: string // Website URL
  rating?: number // Business rating (if available)
  reviewCount?: number // Number of reviews (if available)
  category?: string // Business category/type
  coordinates?: {
    // Geographic coordinates
    latitude: number
    longitude: number
  }
  openingHours?: Record<string, string> // Opening hours by day
  rawData?: unknown // Original platform data
}
```

## Search Query Format

The search query should be a concatenated string with both business name and location:

```typescript
interface BusinessSearchQuery {
  query: string // "Business Name City State" or "Business Name Address"
  limit?: number // Optional result limit
}
```

### Examples:

- `"McDonald's San Francisco CA"`
- `"Pizza Hut 123 Main St Boston MA"`
- `"Whole Foods Market Seattle WA"`
- `"Starbucks Times Square New York NY"`

## API Keys Setup

Each platform requires different authentication:

- **Google**: Places API key from Google Cloud Console
- **Yelp**: API key from Yelp Developers
- **Bing**: API key from Bing Maps Dev Center
- **Apple**: JWT token for MapKit JS
- **Facebook**: Access token with appropriate permissions

## Error Handling

All platform searches include error handling. If a platform fails, it returns an empty array and logs the error:

```typescript
try {
  const results = await searchBusinessesOnPlatform(
    'google_business',
    query,
    apiKey
  )
  // Handle successful results
} catch (error) {
  console.error('Search failed:', error.message)
  // Handle error case
}
```

## Development

### Adding New Platforms

1. Create a new directory under `src/platforms/`
2. Implement the `PlatformFetcher` interface
3. Add transformation functions for the platform's data format
4. Export from `src/platforms/index.ts`
5. Add to the registry in `src/registry.ts`

### Platform Fetcher Interface

```typescript
interface PlatformFetcher {
  searchBusinesses: (
    searchQuery: BusinessSearchQuery,
    apiKey?: string
  ) => Promise<BusinessProfile[]>
}
```
