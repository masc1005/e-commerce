import { OrderItemRepository } from '@/repositories/order-item.repository'

const orderItemRepository = new OrderItemRepository()

export async function deleteOrderItem(id: string): Promise<boolean> {
  return await orderItemRepository.delete(id)
}
