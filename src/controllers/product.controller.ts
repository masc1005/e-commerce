import { Request, Response } from 'express'
import { ProductRepository } from '@/repositories/product.repository'
import { CreateProductUseCase } from '@/use-cases/product/create-product'
import { ListProductsUseCase } from '@/use-cases/product/list-products'
import { GetProductByIdUseCase } from '@/use-cases/product/get-product-by-id'
import { UpdateProductUseCase } from '@/use-cases/product/update-product'
import { DeleteProductUseCase } from '@/use-cases/product/delete-product'

export class ProductController {
  private createProductUseCase: CreateProductUseCase
  private listProductsUseCase: ListProductsUseCase
  private getProductByIdUseCase: GetProductByIdUseCase
  private updateProductUseCase: UpdateProductUseCase
  private deleteProductUseCase: DeleteProductUseCase

  constructor(private productRepository: ProductRepository) {
    this.createProductUseCase = new CreateProductUseCase(productRepository)
    this.listProductsUseCase = new ListProductsUseCase(productRepository)
    this.getProductByIdUseCase = new GetProductByIdUseCase(productRepository)
    this.updateProductUseCase = new UpdateProductUseCase(productRepository)
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository)
  }

  async create(req: Request, res: Response) {
    try {
      const userType = req.user?.type

      if (!userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const product = await this.createProductUseCase.execute({
        data: req.body,
        userType,
      })

      return res.status(201).json({
        message: 'Product created successfully',
        data: product,
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Only admins can create products') {
          return res.status(403).json({ error: error.message })
        }
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const products = await this.listProductsUseCase.execute()

      return res.json({
        message: 'Products found',
        data: products,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await this.getProductByIdUseCase.execute(
        req.params.id as string,
      )

      return res.json({
        data: product,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userType = req.user?.type

      if (!userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const product = await this.updateProductUseCase.execute({
        id: req.params.id as string,
        data: req.body,
        userType,
      })

      return res.json({
        message: 'Product updated successfully',
        data: product,
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Only admins can update products') {
          return res.status(403).json({ error: error.message })
        }
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userType = req.user?.type

      if (!userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const result = await this.deleteProductUseCase.execute({
        id: req.params.id as string,
        userType,
      })

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Only admins can delete products') {
          return res.status(403).json({ error: error.message })
        }
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
