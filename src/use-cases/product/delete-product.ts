import { ProductRepository } from '@/repositories/product.repository'
import { cache } from '@/config/cache'

interface ExecuteParams {
  id: string
  userId: string
  userType: string
}

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(params: ExecuteParams): Promise<{ message: string }> {
    const { id, userType } = params

    if (userType !== 'admin') {
      throw new Error('Only admins can delete products')
    }

    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    await this.productRepository.delete(id)

    await cache.delPattern('products:*')

    return { message: 'Product deleted successfully' }
  }
}
