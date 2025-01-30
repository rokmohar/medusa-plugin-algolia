import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { ProductEvents } from '@medusajs/utils'
import { AlgoliaService } from '../modules/algolia'

export default async function algoliaProductDeleteHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productId = data.id

  const algoliaService: AlgoliaService = container.resolve('algolia')
  await algoliaService.deleteDocument('products', productId)
}

export const config: SubscriberConfig = {
  event: ProductEvents.PRODUCT_DELETED,
}
