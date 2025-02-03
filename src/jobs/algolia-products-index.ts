import { MedusaContainer } from '@medusajs/framework'
import { AlgoliaService } from '../modules/algolia'
import { SearchUtils } from '@medusajs/utils'
import { CronJobConfig } from '../models/CronJobConfig'

export default async function algoliaProductsIndexJob(container: MedusaContainer) {
  const productService = container.resolve('product')
  const algoliaService: AlgoliaService = container.resolve('algolia')

  const products = await productService.listProducts()
  await algoliaService.addDocuments('products', products, SearchUtils.indexTypes.PRODUCTS)
}

export const config: CronJobConfig = {
  name: 'algolia-products-index',
  schedule: '* * * * *',
  numberOfExecutions: 1,
}
