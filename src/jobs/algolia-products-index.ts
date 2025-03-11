import { MedusaContainer } from '@medusajs/framework'
import { AlgoliaService } from '../modules/algolia'
import { SearchUtils } from '@medusajs/utils'
import { CronJobConfig } from '../models/CronJobConfig'

export default async function algoliaProductsIndexJob(container: MedusaContainer) {
  const productService = container.resolve('product')
  const algoliaService: AlgoliaService = container.resolve('algolia')

  const products = await productService.listProducts()

  const publishedProducts = products.filter((p) => p.status === 'published')
  const deleteDocumentIds = products.filter((p) => p.status !== 'published').map((p) => p.id)

  await algoliaService.addDocuments('products', publishedProducts, SearchUtils.indexTypes.PRODUCTS)
  await algoliaService.deleteDocuments('products', deleteDocumentIds)
}

export const config: CronJobConfig = {
  name: 'algolia-products-index',
  schedule: '* * * * *',
  numberOfExecutions: 1,
}
