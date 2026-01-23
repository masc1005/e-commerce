import { OrderRepository } from '@/repositories/order.repository'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import type { OrderResponseDTO, OrderItemResponseDTO } from '@/types/order/dto'

interface AddItemsToOrderParams {
  orderId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  authenticatedUserId: string
  authenticatedUserType: 'admin' | 'client'
  authenticatedClientId?: string
}

export class AddItemsToOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
  ) {}

  async execute(
    params: AddItemsToOrderParams,
  ): Promise<OrderResponseDTO & { items: OrderItemResponseDTO[] }> {
    const { orderId, items, authenticatedUserType, authenticatedClientId } =
      params

    // Buscar a order
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    // Verificar se o cliente tem permissão para atualizar esta order
    if (authenticatedUserType === 'client') {
      if (!authenticatedClientId || order.clientId !== authenticatedClientId) {
        throw new Error('You can only update your own orders')
      }
    }

    // Adicionar os itens
    for (const item of items) {
      await this.orderItemRepository.create({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
      })
    }

    // Retornar a order atualizada com os itens
    const updatedOrder = await this.orderRepository.findByIdWithItems(orderId)

    if (!updatedOrder) {
      throw new Error('Error fetching updated order')
    }

    return updatedOrder
  }
}
