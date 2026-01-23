import { OrderRepository } from '@/repositories/order.repository'

interface ExecuteParams {
  orderId: string
  authenticatedUserType: string
}

export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: ExecuteParams): Promise<{ message: string }> {
    const { orderId, authenticatedUserType } = params

    if (authenticatedUserType !== 'admin') {
      throw new Error('Only admins can delete orders')
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    await this.orderRepository.delete(orderId)

    return { message: 'Order deleted successfully' }
  }
}
