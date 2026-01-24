import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'

export class DeleteOrderItemUseCase {
  constructor(
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const orderItem = await this.orderItemRepository.findById(id)
    if (!orderItem) {
      return false
    }

    const product = await this.productRepository.findById(orderItem.productId)
    if (product) {
      await this.productRepository.updateStock(
        orderItem.productId,
        product.stock + orderItem.quantity,
      )
    }

    const deleted = await this.orderItemRepository.delete(id)

    if (deleted) {
      await this.orderRepository.updateTotal(orderItem.orderId)
    }

    return deleted
  }
}
