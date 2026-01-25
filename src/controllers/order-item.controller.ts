import { Request, Response } from 'express'
import { OrderItemRepository } from '@/repositories/order-item.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'
import {
  CreateOrderItemUseCase,
  DeleteOrderItemUseCase,
  GetOrderItemByIdUseCase,
  ListOrderItemsUseCase,
  UpdateOrderItemUseCase,
} from '@/use-cases/order-item'

export class OrderItemController {
  private createOrderItemUseCase: CreateOrderItemUseCase
  private listOrderItemsUseCase: ListOrderItemsUseCase
  private getOrderItemByIdUseCase: GetOrderItemByIdUseCase
  private updateOrderItemUseCase: UpdateOrderItemUseCase
  private deleteOrderItemUseCase: DeleteOrderItemUseCase

  constructor(
    private orderItemRepository: OrderItemRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
  ) {
    this.createOrderItemUseCase = new CreateOrderItemUseCase(
      orderItemRepository,
      productRepository,
      orderRepository,
    )
    this.listOrderItemsUseCase = new ListOrderItemsUseCase(orderItemRepository)
    this.getOrderItemByIdUseCase = new GetOrderItemByIdUseCase(
      orderItemRepository,
    )
    this.updateOrderItemUseCase = new UpdateOrderItemUseCase(
      orderItemRepository,
      productRepository,
      orderRepository,
    )
    this.deleteOrderItemUseCase = new DeleteOrderItemUseCase(
      orderItemRepository,
      productRepository,
      orderRepository,
    )
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, productId, quantity } = req.body
      const userId = req.user?.id as string
      const orderItem = await this.createOrderItemUseCase.execute(
        { orderId, productId, quantity },
        userId,
      )
      res.status(201).json(orderItem)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Erro ao criar item do pedido' })
      }
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const orderItems = await this.listOrderItemsUseCase.execute()
      res.status(200).json(orderItems)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar itens de pedidos' })
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string
      const orderItem = await this.getOrderItemByIdUseCase.execute(id)

      if (!orderItem) {
        res.status(404).json({ error: 'Item do pedido não encontrado' })
        return
      }

      res.status(200).json(orderItem)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar item do pedido' })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string
      const { quantity } = req.body
      const orderItem = await this.updateOrderItemUseCase.execute(id, quantity)

      if (!orderItem) {
        res.status(404).json({ error: 'Item do pedido não encontrado' })
        return
      }

      res.status(200).json(orderItem)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Erro ao atualizar item do pedido' })
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string
      const result = await this.deleteOrderItemUseCase.execute(id)

      if (!result.deleted) {
        res.status(404).json({ error: 'Item do pedido não encontrado' })
        return
      }

      res.status(200).json({
        message: `Item removed from your order: ${result.orderId}`,
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar item do pedido' })
    }
  }
}
