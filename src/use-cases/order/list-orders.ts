import { OrderRepository, OrderFilters } from '@/repositories/order.repository'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import type { OrderResponseDTO } from '@/types/order/dto'

interface ExecuteParams {
  authenticatedUserId: string
  authenticatedUserType: string
  pagination?: PaginationParams
  filters?: OrderFilters
}

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: ExecuteParams): Promise<PaginatedResponse<OrderResponseDTO>> {
    const { authenticatedUserId, authenticatedUserType, pagination, filters } = params

    if (authenticatedUserType === 'admin') {
      return await this.orderRepository.list(pagination, filters)
    }

    return await this.orderRepository.listByClient(authenticatedUserId, pagination)
  }
}
