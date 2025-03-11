import { SearchTypes } from '@medusajs/types'
import { SearchUtils } from '@medusajs/utils'
import { SearchClient, searchClient } from 'algoliasearch'
import { AlgoliaPluginOptions, SearchOptions } from '../types'
import { transformProduct } from '../utils/transformer'

export class AlgoliaService extends SearchUtils.AbstractSearchService {
  static identifier = 'index-algolia'

  isDefault = false

  protected readonly config_: AlgoliaPluginOptions
  protected readonly client_: SearchClient

  constructor(container: any, options: AlgoliaPluginOptions) {
    super(container, options)

    this.config_ = options

    const { applicationId, adminApiKey } = options

    if (!applicationId) {
      throw new Error('Please provide a valid Application ID')
    }

    if (!adminApiKey) {
      throw new Error('Please provide a valid Admin Api Key')
    }

    this.client_ = searchClient(applicationId, adminApiKey)
  }

  createIndex() {
    // Create index is removed from the Algolia API
  }

  async getIndex(indexName: string) {
    let hits: Record<string, unknown>[] = []

    await this.client_.browseObjects({
      indexName,
      aggregator: (results) => {
        hits = hits.concat(results.hits)
      },
    })

    return hits
  }

  async addDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = await this.getTransformedDocuments(type, documents)

    return await this.client_.saveObjects({ indexName, objects: transformedDocuments })
  }

  async replaceDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = await this.getTransformedDocuments(type, documents)
    return await this.client_.replaceAllObjects({ indexName, objects: transformedDocuments })
  }

  async deleteDocument(indexName: string, documentId: string) {
    return await this.client_.deleteObject({ indexName, objectID: documentId })
  }

  async deleteDocuments(indexName: string, documentIds: string[]) {
    return await this.client_.deleteObjects({ indexName, objectIDs: documentIds })
  }

  async deleteAllDocuments(indexName: string) {
    return await this.client_.deleteIndex({ indexName })
  }

  async search(indexName: string, query: string, options: SearchOptions & Record<string, unknown>) {
    const { paginationOptions, filter, additionalOptions } = options

    // Fit our pagination options to what Algolia expects
    if ('limit' in paginationOptions && paginationOptions.limit != null) {
      paginationOptions['length'] = paginationOptions.limit
      delete paginationOptions.limit
    }

    return await this.client_.searchSingleIndex({
      indexName,
      searchParams: {
        query,
        filters: filter,
        ...paginationOptions,
        ...additionalOptions,
      },
    })
  }

  async updateSettings(indexName: string, settings: SearchTypes.IndexSettings & Record<string, unknown>) {
    const indexSettings = settings.indexSettings ?? {}
    return await this.client_.setSettings({ indexName, indexSettings })
  }

  async getTransformedDocuments(type: string, documents: any[]) {
    if (!documents?.length) {
      return []
    }

    switch (type) {
      case SearchUtils.indexTypes.PRODUCTS:
        const productsTransformer =
          this.config_.settings?.[SearchUtils.indexTypes.PRODUCTS]?.transformer ?? transformProduct

        return documents.map(productsTransformer)
      default:
        return documents
    }
  }
}
