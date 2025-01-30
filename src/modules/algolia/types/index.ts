import { SearchTypes } from '@medusajs/types'

export type SearchOptions = {
  filter: string
  paginationOptions: Record<string, unknown>
  additionalOptions: Record<string, unknown>
}

export interface AlgoliaPluginOptions {
  applicationId: string
  adminApiKey: string
  settings?: {
    [key: string]: SearchTypes.IndexSettings
  }
}
