import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateOrderStatusUseCase } from '@/use-cases/order/update-order-status'
import { OrderRepository } from '@/repositories/order.repository'

describe('UpdateOrderStatusUseCase', () => {
  let updateOrderStatusUseCase: UpdateOrderStatusUseCase
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

    updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository)
  })

  it('should update order status when user is admin', async () => {
    const mockOrder = {
      id: 'order-id',
      clientId: 'client-id',
      status: 'preparing' as const,
      orderDate: new Date(),
      total: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(orderRepository.findById).mockResolvedValue(mockOrder)
    vi.mocked(orderRepository.updateStatus).mockResolvedValue(mockOrder)

    const result = await updateOrderStatusUseCase.execute({
      orderId: 'order-id',
      status: 'preparing',
      authenticatedUserType: 'admin',
    })

    expect(result).toEqual(mockOrder)
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(
      'order-id',
      'preparing',
    )
  })

  it('should throw error when user is not admin', async () => {
    await expect(
      updateOrderStatusUseCase.execute({
        orderId: 'order-id',
        status: 'preparing',
        authenticatedUserType: 'client',
      }),
    ).rejects.toThrow('Only admins can update order status')

    expect(orderRepository.updateStatus).not.toHaveBeenCalled()
  })
})
