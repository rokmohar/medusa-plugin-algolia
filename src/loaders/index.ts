import { LoaderOptions } from '@medusajs/types'
import { AlgoliaService } from '../services'
import { AlgoliaPluginOptions } from '../types'
import { asValue } from 'awilix'

export default async ({ container, options }: LoaderOptions<AlgoliaPluginOptions>): Promise<void> => {
  if (!options) {
    throw new Error('Missing algolia configuration')
  }

  const algoliaService: AlgoliaService = new AlgoliaService(container, options)
  const { settings } = options

  container.register({
    algoliaService: asValue(algoliaService),
  })

  await Promise.all(
    Object.entries(settings || {}).map(async ([indexName, value]) => {
      return await algoliaService.updateSettings(indexName, value)
    }),
  )
}
