import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'
import { CreateOrderItemDTO, OrderItemResponseDTO } from '@/types'

export class CreateOrderItemUseCase {
  constructor(
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(
    data: CreateOrderItemDTO,
    userId: string,
  ): Promise<OrderItemResponseDTO> {
    const order = await this.orderRepository.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.clientId !== userId) {
      throw new Error('You do not have permission to add items to this order')
    }

    const product = await this.productRepository.findById(data.productId)

    if (!product) {
      throw new Error('Product not found')
    }

    if (product.stock < data.quantity) {
      throw new Error('Insufficient stock')
    }

    const orderItem = await this.orderItemRepository.create({
      orderId: data.orderId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: product.price.toString(),
    })

    await this.productRepository.updateStock(
      data.productId,
      product.stock - data.quantity,
    )

    await this.orderRepository.updateTotal(data.orderId)

    return orderItem
  }
}
