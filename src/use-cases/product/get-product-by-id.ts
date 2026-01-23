import { ProductRepository } from '@/repositories/product.repository'
import type { ProductResponseDTO } from '@/types/product/dto'

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }
}
