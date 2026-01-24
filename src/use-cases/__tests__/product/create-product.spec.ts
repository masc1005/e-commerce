import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateProductUseCase } from '@/use-cases/product/create-product'
import { ProductRepository } from '@/repositories/product.repository'

describe('CreateProductUseCase', () => {
  let createProductUseCase: CreateProductUseCase
  let productRepository: ProductRepository

  beforeEach(() => {
    productRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      updateStock: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    } as any

    createProductUseCase = new CreateProductUseCase(productRepository)
  })

  it('should create product when user is admin', async () => {
    const mockProduct = {
      id: 'product-id',
      name: 'New Product',
      description: 'Product description',
      price: 99.99,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.create).mockResolvedValue(mockProduct)

    const result = await createProductUseCase.execute({
      data: {
        name: 'New Product',
        description: 'Product description',
        price: 99.99,
        stock: 50,
      },
      userId: 'admin-id',
      userType: 'admin',
    })

    expect(result).toEqual(mockProduct)
    expect(productRepository.create).toHaveBeenCalledWith({
      name: 'New Product',
      description: 'Product description',
      price: 99.99,
      stock: 50,
    })
  })

  it('should throw error when non-admin tries to create product', async () => {
    await expect(
      createProductUseCase.execute({
        data: {
          name: 'New Product',
          description: 'Product description',
          price: 99.99,
          stock: 50,
        },
        userId: 'client-id',
        userType: 'client',
      }),
    ).rejects.toThrow('Only admins can create products')

    expect(productRepository.create).not.toHaveBeenCalled()
  })
})
