import { OrderItemRepository } from '@/repositories/order-item.repository'
import { CreateOrderItemDTO, OrderItemResponseDTO } from '@/types'

const orderItemRepository = new OrderItemRepository()

export async function createOrderItem(
  data: CreateOrderItemDTO,
): Promise<OrderItemResponseDTO> {
  return await orderItemRepository.create(data)
}
