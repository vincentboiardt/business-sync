# @repo/eslint-config

Shared ESLint configuration for Business Sync projects.

## Usage

In your `.eslintrc.js`:

```js
module.exports = {
  extends: ['@repo/eslint-config'],
}
```

Or in `eslint.config.mjs`:

```js
import config from '@business-sync/eslint-config'

export default config
```
