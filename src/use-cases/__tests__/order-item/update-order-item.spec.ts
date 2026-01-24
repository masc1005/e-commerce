import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateOrderItemUseCase } from '@/use-cases/order-item/update-order-item'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'

describe('UpdateOrderItemUseCase', () => {
  let updateOrderItemUseCase: UpdateOrderItemUseCase
  let orderItemRepository: OrderItemRepository
  let productRepository: ProductRepository
  let orderRepository: OrderRepository

  beforeEach(() => {
    orderItemRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
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

    orderRepository = {
      updateTotal: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByIdWithItems: vi.fn(),
      list: vi.fn(),
      listByClient: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    } as any

    updateOrderItemUseCase = new UpdateOrderItemUseCase(
      orderItemRepository,
      productRepository,
      orderRepository,
    )
  })

  it('deve atualizar quantidade aumentando o item', async () => {
    const mockOrderItem = {
      id: 'item-id',
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 2,
      unitPrice: 100,
      subtotal: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockProduct = {
      id: 'product-id',
      name: 'Produto',
      description: 'Desc',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockUpdated = { ...mockOrderItem, quantity: 5, subtotal: 500 }

    vi.mocked(orderItemRepository.findById).mockResolvedValue(mockOrderItem)
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderItemRepository.update).mockResolvedValue(mockUpdated)

    await updateOrderItemUseCase.execute('item-id', 5)

    expect(productRepository.updateStock).toHaveBeenCalledWith('product-id', 7)
    expect(orderRepository.updateTotal).toHaveBeenCalledWith('order-id')
  })

  it('deve atualizar quantidade diminuindo o item', async () => {
    const mockOrderItem = {
      id: 'item-id',
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 5,
      unitPrice: 100,
      subtotal: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockProduct = {
      id: 'product-id',
      name: 'Produto',
      description: 'Desc',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockUpdated = { ...mockOrderItem, quantity: 2, subtotal: 200 }

    vi.mocked(orderItemRepository.findById).mockResolvedValue(mockOrderItem)
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderItemRepository.update).mockResolvedValue(mockUpdated)

    await updateOrderItemUseCase.execute('item-id', 2)

    expect(productRepository.updateStock).toHaveBeenCalledWith('product-id', 13)
    expect(orderRepository.updateTotal).toHaveBeenCalledWith('order-id')
  })

  it('deve retornar null quando item não existe', async () => {
    vi.mocked(orderItemRepository.findById).mockResolvedValue(null)

    const result = await updateOrderItemUseCase.execute('item-id', 5)

    expect(result).toBeNull()
    expect(productRepository.findById).not.toHaveBeenCalled()
    expect(orderItemRepository.update).not.toHaveBeenCalled()
  })

  it('deve lançar erro quando estoque insuficiente para aumentar quantidade', async () => {
    const mockOrderItem = {
      id: 'item-id',
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 2,
      unitPrice: 100,
      subtotal: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockProduct = {
      id: 'product-id',
      name: 'Produto',
      description: 'Desc',
      price: 100,
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(orderItemRepository.findById).mockResolvedValue(mockOrderItem)
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)

    await expect(
      updateOrderItemUseCase.execute('item-id', 10),
    ).rejects.toThrow('Estoque insuficiente')
  })
})
