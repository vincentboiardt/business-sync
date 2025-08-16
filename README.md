# Business Sync Monorepo

A Turborepo monorepo for the Business Sync application.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `apps/web`: Next.js web application
- `packages/eslint-config`: Shared ESLint configurations
- `packages/typescript-config`: Shared TypeScript configurations
- `packages/supabase`: Shared Supabase client and database utilities

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Turborepo](https://turbo.build/repo) for build orchestration

## Getting Started

### Install dependencies

```bash
npm install
```

### Build all packages

```bash
npm run build
```

### Develop all packages

```bash
npm run dev
```

### Lint all packages

```bash
npm run lint
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
