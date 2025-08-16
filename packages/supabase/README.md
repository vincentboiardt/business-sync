# @repo/supabase

Shared Supabase configuration and utilities for Business Sync projects.

## Structure

- `migrations/` - Database migrations
- `src/` - TypeScript client code
- `lib/` - Compiled JavaScript output

## Usage

```typescript
import {
  createClientComponentClient,
  supabaseClient,
  supabaseAdmin,
  Database,
} from '@repo/supabase'

// Use the client
const client = createClientComponentClient()
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- And more Supabase CLI commands...
