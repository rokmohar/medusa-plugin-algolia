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

## Configuration

Add the plugin to your `medusa-config.ts` file:

```js
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  // ... other config
  modules: [
    // ... other modules
    {
      resolve: '@rokmohar/medusa-plugin-algolia',
      options: {
        applicationId: process.env.ALGOLIA_APP_ID,
        adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: ["title", "description"],
              attributesToRetrieve: [
                "id",
                "title",
                "description",
                "handle",
                "thumbnail",
                "variants",
                "variant_sku",
                "options",
                "collection_title",
                "collection_handle",
                "images",
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

## Subscribers

You must add the following subscribers to the `src/subscribers`:

### product-upsert.ts

```js
import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { ProductEvents, SearchUtils } from '@medusajs/utils'

export default async function productUpsertHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  const productId = data.id

  const productModuleService = container.resolve(Modules.PRODUCT)
  const algoliaSearchService = container.resolve('algolia')

  const product = await productModuleService.retrieveProduct(productId)
  await algoliaSearchService.addDocuments('products', [product], SearchUtils.indexTypes.PRODUCTS)
}

export const config: SubscriberConfig = {
  event: [ProductEvents.PRODUCT_CREATED, ProductEvents.PRODUCT_UPDATED],
}
```

### product-delete.ts

```js
import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { ProductEvents } from '@medusajs/utils'

export default async function productDeleteHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
    const productId = data.id

    const algoliaSearchService = container.resolve('algolia')
    await algoliaSearchService.deleteDocument('products', productId)
}

export const config: SubscriberConfig = {
    event: ProductEvents.PRODUCT_DELETED,
}
```

## Add search to Medusa NextJS starter

You can find instructions on how to add search to a Medusa NextJS starter inside the [nextjs](nextjs) folder.
