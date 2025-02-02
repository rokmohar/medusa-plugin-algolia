# Algolia plugin for Medusa V2

## Installation

Run the following command to install the plugin with **npm**:

```bash
npm install --save @rokmohar/medusa-plugin-algolia
```

Or with **yarn**:

```bash
yarn add @rokmohar/medusa-plugin-algolia
```

### Upgrade to v1.0

_This step is required only if you are upgrading from previous version to v1.0._

- The plugin now supports new MedusaJS plugin system.
- Subscribers are included in the plugin.
- You don't need custom subscribers anymore, you can remove them.

## ⚠️ MedusaJS v2.4.0 or newer

This plugin is only for MedusaJS v2.4.0 or newer.

If you are using MedusaJS v2.3.1 or older, please use the [older version of this plugin](https://github.com/rokmohar/medusa-plugin-algolia/tree/v0.1.1).

## Configuration

Add the plugin to your `medusa-config.ts` file:

```js
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  // ... other config
  plugins: [
    // ... other plugins
    {
      resolve: '@rokmohar/medusa-plugin-algolia',
      options: {
        applicationId: process.env.ALGOLIA_APP_ID,
        adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: ['title', 'description'],
              attributesToRetrieve: [
                'id',
                'title',
                'description',
                'handle',
                'thumbnail',
                'variants',
                'variant_sku',
                'options',
                'collection_title',
                'collection_handle',
                'images',
              ],
            },
            // Create your own transformer
            /*transformer: (product) => ({
              id: product.id,
              // other attributes...
            }),*/
          },
        },
      },
    },
  ],
})
```

## ENV variables

Add the environment variables to your `.env` and `.env.template` file:

```env
# ... others vars
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_API_KEY=
```

## Add search to Medusa NextJS starter

You can find instructions on how to add search to a Medusa NextJS starter inside the [nextjs](nextjs) folder.
