import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateOrderItemUseCase } from '@/use-cases/order-item/create-order-item'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'

describe('CreateOrderItemUseCase', () => {
  let createOrderItemUseCase: CreateOrderItemUseCase
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

    createOrderItemUseCase = new CreateOrderItemUseCase(
      orderItemRepository,
      productRepository,
      orderRepository,
    )
  })

  it('deve criar um item de pedido com sucesso', async () => {
    const mockProduct = {
      id: 'product-id',
      name: 'Produto Teste',
      description: 'Descrição',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockOrderItem = {
      id: 'order-item-id',
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 2,
      unitPrice: 100,
      subtotal: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderItemRepository.create).mockResolvedValue(mockOrderItem)

    const result = await createOrderItemUseCase.execute({
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 2,
    })

    expect(productRepository.findById).toHaveBeenCalledWith('product-id')
    expect(orderItemRepository.create).toHaveBeenCalledWith({
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 2,
      unitPrice: '100',
    })
    expect(productRepository.updateStock).toHaveBeenCalledWith('product-id', 8)
    expect(orderRepository.updateTotal).toHaveBeenCalledWith('order-id')
    expect(result).toEqual(mockOrderItem)
  })

  it('deve lançar erro quando produto não existe', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)

    await expect(
      createOrderItemUseCase.execute({
        orderId: 'order-id',
        productId: 'product-id',
        quantity: 2,
      }),
    ).rejects.toThrow('Produto não encontrado')

    expect(orderItemRepository.create).not.toHaveBeenCalled()
    expect(productRepository.updateStock).not.toHaveBeenCalled()
    expect(orderRepository.updateTotal).not.toHaveBeenCalled()
  })

  it('deve lançar erro quando estoque é insuficiente', async () => {
    const mockProduct = {
      id: 'product-id',
      name: 'Produto Teste',
      description: 'Descrição',
      price: 100,
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)

    await expect(
      createOrderItemUseCase.execute({
        orderId: 'order-id',
        productId: 'product-id',
        quantity: 5,
      }),
    ).rejects.toThrow('Estoque insuficiente')

    expect(orderItemRepository.create).not.toHaveBeenCalled()
    expect(productRepository.updateStock).not.toHaveBeenCalled()
    expect(orderRepository.updateTotal).not.toHaveBeenCalled()
  })

  it('deve reduzir o estoque corretamente', async () => {
    const mockProduct = {
      id: 'product-id',
      name: 'Produto Teste',
      description: 'Descrição',
      price: 50,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockOrderItem = {
      id: 'order-item-id',
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 3,
      unitPrice: 50,
      subtotal: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(orderItemRepository.create).mockResolvedValue(mockOrderItem)

    await createOrderItemUseCase.execute({
      orderId: 'order-id',
      productId: 'product-id',
      quantity: 3,
    })

    expect(productRepository.updateStock).toHaveBeenCalledWith('product-id', 17)
  })
})
