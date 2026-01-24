import { Request, Response } from 'express'
import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { CreateOrderUseCase } from '@/use-cases/order/create-order'
import { ListOrdersUseCase } from '@/use-cases/order/list-orders'
import { GetOrderByIdUseCase } from '@/use-cases/order/get-order-by-id'
import { UpdateOrderStatusUseCase } from '@/use-cases/order/update-order-status'
import { DeleteOrderUseCase } from '@/use-cases/order/delete-order'

export class OrderController {
  private createOrderUseCase: CreateOrderUseCase
  private listOrdersUseCase: ListOrdersUseCase
  private getOrderByIdUseCase: GetOrderByIdUseCase
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase
  private deleteOrderUseCase: DeleteOrderUseCase

  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {
    this.createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      productRepository,
    )
    this.listOrdersUseCase = new ListOrdersUseCase(orderRepository)
    this.getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository)
    this.updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
      orderRepository,
    )
    this.deleteOrderUseCase = new DeleteOrderUseCase(orderRepository)
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const orderData = { ...req.body }
      
      if (userType !== 'admin') {
        orderData.clientId = userId
      }

      const order = await this.createOrderUseCase.execute({
        data: orderData,
        authenticatedUserId: userId,
        authenticatedUserType: userType,
      })

      return res.status(201).json({
        message: 'Order created successfully',
        data: order,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const page = req.query.page ? parseInt(req.query.page as string) : undefined
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined

      const result = await this.listOrdersUseCase.execute({
        authenticatedUserId: userId,
        authenticatedUserType: userType,
        pagination: { page, limit },
      })

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const userType = req.user?.type

      if (!userId || !userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const order = await this.getOrderByIdUseCase.execute({
        orderId: req.params.id as string,
        authenticatedUserId: userId,
        authenticatedUserType: userType,
      })

      return res.json({
        data: order,
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const userType = req.user?.type

      if (!userType) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const order = await this.updateOrderStatusUseCase.execute({
        orderId: req.params.id as string,
        status: req.body.status,
        authenticatedUserType: userType,
      })

      return res.json({
        message: 'Order status updated successfully',
        data: order,
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Only admins can update order status') {
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

      const result = await this.deleteOrderUseCase.execute({
        orderId: req.params.id as string,
        authenticatedUserType: userType,
      })

      return res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Only admins can delete orders') {
          return res.status(403).json({ error: error.message })
        }
        return res.status(404).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
