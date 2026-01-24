import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateProductUseCase } from '@/use-cases/product/update-product'
import { ProductRepository } from '@/repositories/product.repository'

describe('UpdateProductUseCase', () => {
  let updateProductUseCase: UpdateProductUseCase
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

    updateProductUseCase = new UpdateProductUseCase(productRepository)
  })

  it('should update product when user is admin', async () => {
    const mockProduct = {
      id: 'product-id',
      name: 'Updated Product',
      description: 'Updated description',
      price: 150,
      stock: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(productRepository.update).mockResolvedValue(mockProduct)

    const result = await updateProductUseCase.execute({
      id: 'product-id',
      data: {
        name: 'Updated Product',
        price: 150,
      },
      userId: 'admin-id',
      userType: 'admin',
    })

    expect(result).toEqual(mockProduct)
    expect(productRepository.update).toHaveBeenCalledWith('product-id', {
      name: 'Updated Product',
      price: 150,
    })
  })

  it('should throw error when non-admin tries to update product', async () => {
    await expect(
      updateProductUseCase.execute({
        id: 'product-id',
        data: {
          name: 'Updated Product',
        },
        userId: 'client-id',
        userType: 'client',
      }),
    ).rejects.toThrow('Only admins can update products')

    expect(productRepository.update).not.toHaveBeenCalled()
  })
})
