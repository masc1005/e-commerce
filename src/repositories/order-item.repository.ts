import { db } from '@/config/database/connection'
import { orderItemsTable } from '@/config/database/schemas'
import { productsTable } from '@/config/database/schemas/products.schema'
import { CreateOrderItemDTO, OrderItemResponseDTO } from '@/types'
import { eq } from 'drizzle-orm'

export class OrderItemRepository {
  async create(data: CreateOrderItemDTO): Promise<OrderItemResponseDTO> {
    const product = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, data.productId),
    })

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    if (product.stock < data.quantity) {
      throw new Error('Estoque insuficiente')
    }

    const [orderItem] = await db
      .insert(orderItemsTable)
      .values({
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: product.price.toString(),
      })
      .returning()

    await db
      .update(productsTable)
      .set({ stock: product.stock - data.quantity })
      .where(eq(productsTable.id, data.productId))

    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      unitPrice: parseFloat(orderItem.unitPrice),
      subtotal: parseFloat(orderItem.subtotal!),
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
    }
  }

  async findAll(): Promise<OrderItemResponseDTO[]> {
    const orderItems = await db.select().from(orderItemsTable)

    return orderItems.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice),
      subtotal: parseFloat(item.subtotal!),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  }

  async findById(id: string): Promise<OrderItemResponseDTO | null> {
    const orderItem = await db.query.orderItemsTable.findFirst({
      where: eq(orderItemsTable.id, id),
    })

    if (!orderItem) {
      return null
    }

    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      unitPrice: parseFloat(orderItem.unitPrice),
      subtotal: parseFloat(orderItem.subtotal!),
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
    }
  }

  async update(
    id: string,
    quantity: number,
  ): Promise<OrderItemResponseDTO | null> {
    const orderItem = await this.findById(id)
    if (!orderItem) {
      return null
    }

    const product = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, orderItem.productId),
    })

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const quantityDifference = quantity - orderItem.quantity

    if (quantityDifference > 0) {
      if (product.stock < quantityDifference) {
        throw new Error('Estoque insuficiente')
      }

      await db
        .update(productsTable)
        .set({ stock: product.stock - quantityDifference })
        .where(eq(productsTable.id, orderItem.productId))
    } else if (quantityDifference < 0) {
      await db
        .update(productsTable)
        .set({ stock: product.stock + Math.abs(quantityDifference) })
        .where(eq(productsTable.id, orderItem.productId))
    }

    const [updated] = await db
      .update(orderItemsTable)
      .set({ quantity })
      .where(eq(orderItemsTable.id, id))
      .returning()

    return {
      id: updated.id,
      orderId: updated.orderId,
      productId: updated.productId,
      quantity: updated.quantity,
      unitPrice: parseFloat(updated.unitPrice),
      subtotal: parseFloat(updated.subtotal!),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }

  async delete(id: string): Promise<boolean> {
    const orderItem = await this.findById(id)
    if (!orderItem) {
      return false
    }

    const product = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, orderItem.productId),
    })

    if (product) {
      await db
        .update(productsTable)
        .set({ stock: product.stock + orderItem.quantity })
        .where(eq(productsTable.id, orderItem.productId))
    }

    await db.delete(orderItemsTable).where(eq(orderItemsTable.id, id))

    return true
  }
}
