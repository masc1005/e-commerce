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
      throw new Error('Pedido não encontrado')
    }

    if (order.clientId !== userId) {
      throw new Error(
        'Você não tem permissão para adicionar itens a este pedido',
      )
    }

    const product = await this.productRepository.findById(data.productId)

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    if (product.stock < data.quantity) {
      throw new Error('Estoque insuficiente')
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
