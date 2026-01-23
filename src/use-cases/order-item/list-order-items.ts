import { OrderItemRepository } from '@/repositories/order-item.repository'
import { OrderItemResponseDTO } from '@/types'

const orderItemRepository = new OrderItemRepository()

export async function listOrderItems(): Promise<OrderItemResponseDTO[]> {
  return await orderItemRepository.findAll()
}
