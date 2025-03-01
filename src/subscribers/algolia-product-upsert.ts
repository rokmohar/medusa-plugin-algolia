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
  await algoliaService.addDocuments('products', [product], SearchUtils.indexTypes.PRODUCTS)
}

export const config: SubscriberConfig = {
  event: [ProductEvents.PRODUCT_CREATED, ProductEvents.PRODUCT_UPDATED],
}
