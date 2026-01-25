import {
  ProductRepository,
  ProductFilters,
} from '@/repositories/product.repository'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import type { ProductResponseDTO } from '@/types/product/dto'
import { cache } from '@/config/cache'

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(
    params?: PaginationParams,
    filters?: ProductFilters,
  ): Promise<PaginatedResponse<ProductResponseDTO>> {
    const cacheKey = `products:list:${JSON.stringify({ params, filters })}`

    const cached =
      await cache.get<PaginatedResponse<ProductResponseDTO>>(cacheKey)
    if (cached) {
      return cached
    }

    const result = await this.productRepository.list(params, filters)

    await cache.set(cacheKey, result, 300)

    return result
  }
}
