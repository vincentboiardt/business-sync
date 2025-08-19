# Business Sync - AI Coding Assistant Instructions

## Project Overview

Business Sync is a Turborepo monorepo for managing business listings across multiple platforms (Google, Yelp, Facebook, etc.). The architecture follows a **search-first, claim-based model** where users search for their business across platforms and then claim ownership.

## Core Architecture

### Monorepo Structure

- `apps/web/` - Next.js 14+ app with App Router, Supabase auth
- `packages/platforms/` - Platform integration abstractions and fetchers
- `packages/supabase/` - Database client, migrations, shared types
- `packages/typescript-config/` & `packages/eslint-config/` - Shared tooling

### Database Migrations

- Location: `packages/supabase/migrations/`
- Pattern: `YYYYMMDDHHMMSS_description.sql`
- Always include RLS policies, indexes, and comments
- Use `ALTER TABLE IF EXISTS` and `DROP IF EXISTS` for idempotency
- Essential commands: `npm run supabase:migration:new`, `npm run supabase:db:push`

### UI Development

Use existing components from `apps/web/src/components/` for consistency. Ask when you want to create new components or modify existing ones. The UI should be intuitive and follow the design system established in the project.

Tailwind has config in `apps/web/src/app/globals.css`.

## Other instructions

- Do not create unnecessary "test scripts".
- Do not create README files unless specifically requested.
- Do not write summaries in .md files or documentation unless explicitly asked.
- Do not create unnecessary API routes. Use Supabase client from `packages/supabase/` for database interactions.
- When importing Lucide icons name the import to show context, e.g. `import { Edit as EditIcon } from 'lucide-react'`.
