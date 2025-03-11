import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { Modules, ProductEvents, SearchUtils } from '@medusajs/utils'
import { AlgoliaService } from '../modules/algolia'

export default async function algoliaProductUpsertHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productId = data.id

  const productModuleService = container.resolve(Modules.PRODUCT)
  const algoliaService: AlgoliaService = container.resolve('algolia')

  const product = await productModuleService.retrieveProduct(productId)

  if (product.status === 'published') {
    // If status is "published", add or update the document in MeiliSearch
    await algoliaService.addDocuments('products', [product], SearchUtils.indexTypes.PRODUCTS)
  } else {
    // If status is not "published", remove the document from MeiliSearch
    await algoliaService.deleteDocument('products', productId)
  }
}

export const config: SubscriberConfig = {
  event: [ProductEvents.PRODUCT_CREATED, ProductEvents.PRODUCT_UPDATED],
}
