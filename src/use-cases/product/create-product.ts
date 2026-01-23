import { ProductRepository } from '@/repositories/product.repository'
import type { CreateProductDTO, ProductResponseDTO } from '@/types/product/dto'

interface ExecuteParams {
  data: CreateProductDTO
  userType: string
}

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(params: ExecuteParams): Promise<ProductResponseDTO> {
    const { data, userType } = params

    if (userType !== 'admin') {
      throw new Error('Only admins can create products')
    }

    const product = await this.productRepository.create(data)

    return product
  }
}
