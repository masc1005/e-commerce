import { OrderRepository } from '@/repositories/order.repository'
import type { OrderResponseDTO, OrderItemResponseDTO } from '@/types/order/dto'

interface ExecuteParams {
  orderId: string
  authenticatedUserId: string
  authenticatedUserType: string
}

export class GetOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    params: ExecuteParams,
  ): Promise<OrderResponseDTO & { items: OrderItemResponseDTO[] }> {
    const { orderId, authenticatedUserId, authenticatedUserType } = params

    const order = await this.orderRepository.findByIdWithItems(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (
      authenticatedUserType === 'client' &&
      order.clientId !== authenticatedUserId
    ) {
      throw new Error('You do not have permission to view this order')
    }

    return order
  }
}
