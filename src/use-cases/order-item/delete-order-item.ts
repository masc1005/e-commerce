import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'

export class DeleteOrderItemUseCase {
  constructor(
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<{ deleted: boolean; orderId: string | null }> {
    const orderItem = await this.orderItemRepository.findById(id)
    if (!orderItem) {
      return { deleted: false, orderId: null }
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

    return { deleted, orderId: orderItem.orderId }
  }
}
