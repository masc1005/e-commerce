import { OrderItemRepository } from '@/repositories/order-item.repository'
import { OrderItemResponseDTO } from '@/types'

export class ListOrderItemsUseCase {
  constructor(private orderItemRepository: OrderItemRepository) {}

  async execute(): Promise<OrderItemResponseDTO[]> {
    return await this.orderItemRepository.findAll()
  }
}
