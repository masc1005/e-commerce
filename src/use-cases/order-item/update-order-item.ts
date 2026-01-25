import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'
import { OrderItemResponseDTO } from '@/types'

export class UpdateOrderItemUseCase {
  constructor(
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(
    id: string,
    quantity: number,
  ): Promise<OrderItemResponseDTO | null> {
    const orderItem = await this.orderItemRepository.findById(id)
    if (!orderItem) {
      return null
    }

    const product = await this.productRepository.findById(orderItem.productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const quantityDifference = quantity - orderItem.quantity

    if (quantityDifference > 0) {
      if (product.stock < quantityDifference) {
        throw new Error('Estoque insuficiente')
      }
      await this.productRepository.updateStock(
        orderItem.productId,
        product.stock - quantityDifference,
      )
    } else if (quantityDifference < 0) {
      await this.productRepository.updateStock(
        orderItem.productId,
        product.stock + Math.abs(quantityDifference),
      )
    }

    const updated = await this.orderItemRepository.update(id, quantity)

    if (updated) {
      await this.orderRepository.updateTotal(orderItem.orderId)
    }

    return updated
  }
}
