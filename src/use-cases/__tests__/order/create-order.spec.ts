import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateOrderUseCase } from '@/use-cases/order/create-order'
import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'

describe('CreateOrderUseCase', () => {
  let createOrderUseCase: CreateOrderUseCase
  let orderRepository: OrderRepository
  let productRepository: ProductRepository

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

    productRepository = {
      findById: vi.fn(),
      updateStock: vi.fn(),
      create: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    } as any

    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      productRepository,
    )
  })

  it('should create order for admin', async () => {
    const mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      description: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockOrder = {
      id: 'order-id',
      clientId: 'client-id',
      status: 'received' as const,
      orderDate: new Date(),
      total: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderRepository.create).mockResolvedValue(mockOrder)

    const result = await createOrderUseCase.execute({
      data: {
        clientId: 'client-id',
        items: [{ productId: 'product-1', quantity: 2 }],
      },
      authenticatedUserId: 'admin-id',
      authenticatedUserType: 'admin',
    })

    expect(result).toEqual(mockOrder)
    expect(orderRepository.create).toHaveBeenCalledWith({
      clientId: 'client-id',
      items: [{ productId: 'product-1', quantity: 2, unitPrice: 100 }],
    })
  })

  it('should create order for client with matching clientId', async () => {
    const mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      description: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockOrder = {
      id: 'order-id',
      clientId: 'client-id',
      status: 'received' as const,
      orderDate: new Date(),
      total: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderRepository.create).mockResolvedValue(mockOrder)

    const result = await createOrderUseCase.execute({
      data: {
        clientId: 'client-id',
        items: [{ productId: 'product-1', quantity: 2 }],
      },
      authenticatedUserId: 'client-id',
      authenticatedUserType: 'client',
    })

    expect(result).toEqual(mockOrder)
  })

  it('should throw error when client tries to create order for another client', async () => {
    await expect(
      createOrderUseCase.execute({
        data: {
          clientId: 'other-client-id',
          items: [{ productId: 'product-1', quantity: 2 }],
        },
        authenticatedUserId: 'client-id',
        authenticatedUserType: 'client',
      }),
    ).rejects.toThrow('You can only create orders for yourself')
  })
})
