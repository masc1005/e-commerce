import { ProductRepository } from '@/repositories/product.repository'
import type { ProductResponseDTO } from '@/types/product/dto'

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.list()

    return products
  }
}
