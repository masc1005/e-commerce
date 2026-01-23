import { OrderRepository } from '@/repositories/order.repository'
import type { OrderResponseDTO } from '@/types/order/dto'

interface ExecuteParams {
  authenticatedUserId: string
  authenticatedUserType: string
}

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: ExecuteParams): Promise<OrderResponseDTO[]> {
    const { authenticatedUserId, authenticatedUserType } = params

    if (authenticatedUserType === 'admin') {
      return await this.orderRepository.list()
    }

    return await this.orderRepository.listByClient(authenticatedUserId)
  }
}
