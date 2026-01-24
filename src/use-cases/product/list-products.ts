import { ProductRepository } from '@/repositories/product.repository'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import type { ProductResponseDTO } from '@/types/product/dto'

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(params?: PaginationParams): Promise<PaginatedResponse<ProductResponseDTO>> {
    return await this.productRepository.list(params)
  }
}
