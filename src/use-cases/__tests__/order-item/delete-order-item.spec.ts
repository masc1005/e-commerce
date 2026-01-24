import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteOrderItemUseCase } from '@/use-cases/order-item/delete-order-item'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'

describe('DeleteOrderItemUseCase', () => {
  let deleteOrderItemUseCase: DeleteOrderItemUseCase
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

    deleteOrderItemUseCase = new DeleteOrderItemUseCase(
      orderItemRepository,
      productRepository,
      orderRepository,
    )
  })

  it('deve deletar item e restaurar estoque', async () => {
    const mockOrderItem = {
      id: 'item-id',
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 3,
      unitPrice: 100,
      subtotal: 300,
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

    vi.mocked(orderItemRepository.findById).mockResolvedValue(mockOrderItem)
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderItemRepository.delete).mockResolvedValue(true)

    const result = await deleteOrderItemUseCase.execute('item-id')

    expect(result).toBe(true)
    expect(productRepository.updateStock).toHaveBeenCalledWith('product-id', 13)
    expect(orderItemRepository.delete).toHaveBeenCalledWith('item-id')
    expect(orderRepository.updateTotal).toHaveBeenCalledWith('order-id')
  })

  it('deve retornar false quando item não existe', async () => {
    vi.mocked(orderItemRepository.findById).mockResolvedValue(null)

    const result = await deleteOrderItemUseCase.execute('item-id')

    expect(result).toBe(false)
    expect(productRepository.findById).not.toHaveBeenCalled()
    expect(orderItemRepository.delete).not.toHaveBeenCalled()
    expect(orderRepository.updateTotal).not.toHaveBeenCalled()
  })

  it('deve deletar item mesmo se produto não existir mais', async () => {
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

    vi.mocked(orderItemRepository.findById).mockResolvedValue(mockOrderItem)
    vi.mocked(productRepository.findById).mockResolvedValue(null)
    vi.mocked(orderItemRepository.delete).mockResolvedValue(true)

    const result = await deleteOrderItemUseCase.execute('item-id')

    expect(result).toBe(true)
    expect(productRepository.updateStock).not.toHaveBeenCalled()
    expect(orderRepository.updateTotal).toHaveBeenCalledWith('order-id')
  })
})
