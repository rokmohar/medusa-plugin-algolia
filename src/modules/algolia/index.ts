import { Module } from '@medusajs/utils'
import Loader from './loaders'
import { AlgoliaService } from './services'

export * from './services'
export * from './types'

export default Module('algolia', {
  service: AlgoliaService,
  loaders: [Loader],
})
