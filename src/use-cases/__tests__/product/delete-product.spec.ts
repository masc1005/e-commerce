import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteProductUseCase } from '@/use-cases/product/delete-product'
import { ProductRepository } from '@/repositories/product.repository'

describe('DeleteProductUseCase', () => {
  let deleteProductUseCase: DeleteProductUseCase
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

    deleteProductUseCase = new DeleteProductUseCase(productRepository)
  })

  it('should delete product when user is admin', async () => {
    const mockProduct = {
      id: 'product-id',
      name: 'Test Product',
      price: 100,
      stock: 10,
      description: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct)
    vi.mocked(productRepository.delete).mockResolvedValue(true)

    const result = await deleteProductUseCase.execute({
      id: 'product-id',
      userId: 'admin-id',
      userType: 'admin',
    })

    expect(result).toEqual({ message: 'Product deleted successfully' })
    expect(productRepository.delete).toHaveBeenCalledWith('product-id')
  })

  it('should throw error when non-admin tries to delete product', async () => {
    await expect(
      deleteProductUseCase.execute({
        id: 'product-id',
        userId: 'client-id',
        userType: 'client',
      }),
    ).rejects.toThrow('Only admins can delete products')

    expect(productRepository.delete).not.toHaveBeenCalled()
  })
})
