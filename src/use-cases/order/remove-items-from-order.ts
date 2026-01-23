import { OrderRepository } from '@/repositories/order.repository'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import type { OrderResponseDTO, OrderItemResponseDTO } from '@/types/order/dto'

interface RemoveItemsFromOrderParams {
  orderId: string
  itemIds: string[]
  authenticatedUserId: string
  authenticatedUserType: 'admin' | 'client'
  authenticatedClientId?: string
}

export class RemoveItemsFromOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
  ) {}

  async execute(
    params: RemoveItemsFromOrderParams,
  ): Promise<OrderResponseDTO & { items: OrderItemResponseDTO[] }> {
    const {
      orderId,
      itemIds,
      authenticatedUserType,
      authenticatedClientId,
    } = params

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

    // Remover os itens
    for (const itemId of itemIds) {
      // Verificar se o item pertence à ordem
      const item = await this.orderItemRepository.findById(itemId)

      if (!item) {
        throw new Error(`Order item ${itemId} not found`)
      }

      if (item.orderId !== orderId) {
        throw new Error(`Order item ${itemId} does not belong to this order`)
      }

      await this.orderItemRepository.delete(itemId)
    }

    // Retornar a order atualizada com os itens
    const updatedOrder = await this.orderRepository.findByIdWithItems(orderId)

    if (!updatedOrder) {
      throw new Error('Error fetching updated order')
    }

    return updatedOrder
  }
}
