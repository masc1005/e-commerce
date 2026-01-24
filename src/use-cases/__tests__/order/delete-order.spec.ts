import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteOrderUseCase } from '@/use-cases/order/delete-order'
import { OrderRepository } from '@/repositories/order.repository'

describe('DeleteOrderUseCase', () => {
  let deleteOrderUseCase: DeleteOrderUseCase
  let orderRepository: OrderRepository

  beforeEach(() => {
    orderRepository = {
      create: vi.fn(),
      updateTotal: vi.fn(),
      findById: vi.fn(),
      findByIdWithItems: vi.fn(),
      listByClient: vi.fn(),
      list: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    } as any

    deleteOrderUseCase = new DeleteOrderUseCase(orderRepository)
  })

  it('should delete order when user is admin', async () => {
    const mockOrder = {
      id: 'order-id',
      clientId: 'client-id',
      status: 'received' as const,
      orderDate: new Date(),
      total: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(orderRepository.findById).mockResolvedValue(mockOrder)
    vi.mocked(orderRepository.delete).mockResolvedValue(true)

    const result = await deleteOrderUseCase.execute({
      orderId: 'order-id',
      authenticatedUserType: 'admin',
    })

    expect(result).toEqual({ message: 'Order deleted successfully' })
    expect(orderRepository.delete).toHaveBeenCalledWith('order-id')
  })

  it('should throw error when non-admin tries to delete order', async () => {
    await expect(
      deleteOrderUseCase.execute({
        orderId: 'order-id',
        authenticatedUserType: 'client',
      }),
    ).rejects.toThrow('Only admins can delete orders')

    expect(orderRepository.delete).not.toHaveBeenCalled()
  })
})
