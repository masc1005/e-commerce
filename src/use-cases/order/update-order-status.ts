import { OrderRepository } from '@/repositories/order.repository'
import type { OrderResponseDTO, UpdateOrderStatusDTO } from '@/types/order/dto'

interface ExecuteParams {
  orderId: string
  status: UpdateOrderStatusDTO['status']
  authenticatedUserType: string
}

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: ExecuteParams): Promise<OrderResponseDTO> {
    const { orderId, status, authenticatedUserType } = params

    if (authenticatedUserType !== 'admin') {
      throw new Error('Only admins can update order status')
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    const updatedOrder = await this.orderRepository.updateStatus(orderId, status)

    if (!updatedOrder) {
      throw new Error('Failed to update order status')
    }

    return updatedOrder
  }
}
