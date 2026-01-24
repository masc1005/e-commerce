import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'
import type { CreateOrderDTO, OrderResponseDTO } from '@/types/order/dto'

interface ExecuteParams {
  data: CreateOrderDTO
  authenticatedUserId: string
  authenticatedUserType: string
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(params: ExecuteParams): Promise<OrderResponseDTO> {
    const { data } = params

    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId)

      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
        )
      }

      item.unitPrice = product.price
    }

    const order = await this.orderRepository.create(data)

    for (const item of data.items) {
      await this.productRepository.update(item.productId, {
        stock:
          (await this.productRepository.findById(item.productId))!.stock -
          item.quantity,
      })
    }

    return order
  }
}
