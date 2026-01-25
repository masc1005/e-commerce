import { db } from '@/config/database/connection'
import { orderItemsTable } from '@/config/database/schemas'
import { productsTable } from '@/config/database/schemas/products.schema'
import { OrderItemResponseDTO } from '@/types'
import { eq } from 'drizzle-orm'

interface CreateOrderItemRepositoryDTO {
  orderId: string
  productId: string
  quantity: number
  unitPrice: string
}

export class OrderItemRepository {
  async create(
    data: CreateOrderItemRepositoryDTO,
  ): Promise<OrderItemResponseDTO> {
    const [orderItem] = await db
      .insert(orderItemsTable)
      .values({
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
      })
      .returning()

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
    const [updated] = await db
      .update(orderItemsTable)
      .set({ quantity })
      .where(eq(orderItemsTable.id, id))
      .returning()

    if (!updated) return null

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
    const result = await db
      .delete(orderItemsTable)
      .where(eq(orderItemsTable.id, id))
      .returning()
    return result.length > 0
  }
}
