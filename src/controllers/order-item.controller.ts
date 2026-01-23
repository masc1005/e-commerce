import { Request, Response } from 'express'
import {
  createOrderItem,
  deleteOrderItem,
  getOrderItemById,
  listOrderItems,
  updateOrderItem,
} from '@/use-cases/order-item'

export class OrderItemController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, productId, quantity } = req.body
      const orderItem = await createOrderItem({ orderId, productId, quantity })
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
      const orderItems = await listOrderItems()
      res.status(200).json(orderItems)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar itens de pedidos' })
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string
      const orderItem = await getOrderItemById(id)

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
      const orderItem = await updateOrderItem(id, quantity)

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
      const deleted = await deleteOrderItem(id)

      if (!deleted) {
        res.status(404).json({ error: 'Item do pedido não encontrado' })
        return
      }

      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar item do pedido' })
    }
  }
}
