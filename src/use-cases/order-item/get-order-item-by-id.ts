import { OrderItemRepository } from '@/repositories/order-item.repository'
import { OrderItemResponseDTO } from '@/types'

const orderItemRepository = new OrderItemRepository()

export async function getOrderItemById(
  id: string,
): Promise<OrderItemResponseDTO | null> {
  return await orderItemRepository.findById(id)
}
