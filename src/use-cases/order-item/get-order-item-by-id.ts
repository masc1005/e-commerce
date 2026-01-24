import { OrderItemRepository } from '@/repositories/order-item.repository'
import { OrderItemResponseDTO } from '@/types'

export class GetOrderItemByIdUseCase {
  constructor(private orderItemRepository: OrderItemRepository) {}

  async execute(id: string): Promise<OrderItemResponseDTO | null> {
    return await this.orderItemRepository.findById(id)
  }
}
