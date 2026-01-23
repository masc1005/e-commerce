import { OrderItemRepository } from '@/repositories/order-item.repository'
import { OrderItemResponseDTO } from '@/types'

const orderItemRepository = new OrderItemRepository()

export async function updateOrderItem(
  id: string,
  quantity: number,
): Promise<OrderItemResponseDTO | null> {
  return await orderItemRepository.update(id, quantity)
}
