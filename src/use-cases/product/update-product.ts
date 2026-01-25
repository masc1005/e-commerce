import { ProductRepository } from '@/repositories/product.repository'
import type { UpdateProductDTO, ProductResponseDTO } from '@/types/product/dto'
import { cache } from '@/config/cache'

interface ExecuteParams {
  id: string
  data: UpdateProductDTO
  userId: string
  userType: string
}

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(params: ExecuteParams): Promise<ProductResponseDTO> {
    const { id, data, userType } = params

    if (userType !== 'admin') {
      throw new Error('Only admins can update products')
    }

    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    const updatedProduct = await this.productRepository.update(id, data)

    if (!updatedProduct) {
      throw new Error('Failed to update product')
    }

    await cache.delPattern('products:*')

    return updatedProduct
  }
}
