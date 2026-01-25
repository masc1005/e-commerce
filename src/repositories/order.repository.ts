import { eq, and, count, gte, lte } from 'drizzle-orm'
import { db } from '@/config/database/connection'
import { ordersTable, orderItemsTable, productsTable } from '@/config/database/schemas'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import type {
  CreateOrderDTO,
  CreateOrderItemDTO,
  OrderResponseDTO,
  OrderItemResponseDTO,
  UpdateOrderStatusDTO,
} from '@/types/order/dto'

export interface OrderFilters {
  clientId?: string
  startDate?: Date
  endDate?: Date
}

export class OrderRepository {
  async create(data: CreateOrderDTO): Promise<OrderResponseDTO> {
    let total = 0
    const itemsWithPrices = []

    for (const item of data.items) {
      const product = await db.query.productsTable.findFirst({
        where: eq(productsTable.id, item.productId),
      })

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`)
      }

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}`)
      }

      const unitPrice = parseFloat(product.price)
      total += item.quantity * unitPrice

      itemsWithPrices.push({
        ...item,
        unitPrice,
      })
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        clientId: data.clientId,
        total: total.toString(),
        status: 'received',
      })
      .returning()

    for (const item of itemsWithPrices) {
      await db.insert(orderItemsTable).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
      })

      const product = await db.query.productsTable.findFirst({
        where: eq(productsTable.id, item.productId),
      })

      if (product) {
        await db
          .update(productsTable)
          .set({ stock: product.stock - item.quantity })
          .where(eq(productsTable.id, item.productId))
      }
    }

    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      orderDate: order.orderDate,
      total: parseFloat(order.total),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  async findById(id: string): Promise<OrderResponseDTO | null> {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))

    if (!order) return null

    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      orderDate: order.orderDate,
      total: parseFloat(order.total),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  async findByIdWithItems(
    id: string,
  ): Promise<(OrderResponseDTO & { items: OrderItemResponseDTO[] }) | null> {
    const order = await this.findById(id)

    if (!order) return null

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id))

    return {
      ...order,
      items: items.map((item) => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice),
        subtotal: parseFloat(item.subtotal),
      })),
    }
  }

  async listByClient(
    clientId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<OrderResponseDTO>> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const offset = (page - 1) * limit

    const [orders, totalResult] = await Promise.all([
      db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.clientId, clientId))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(ordersTable)
        .where(eq(ordersTable.clientId, clientId)),
    ])

    const total = totalResult[0].count
    const totalPages = Math.ceil(total / limit)

    return {
      data: orders.map((order) => ({
        id: order.id,
        clientId: order.clientId,
        status: order.status,
        orderDate: order.orderDate,
        total: parseFloat(order.total),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async list(params?: PaginationParams, filters?: OrderFilters): Promise<PaginatedResponse<OrderResponseDTO>> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const offset = (page - 1) * limit

    const conditions = []

    if (filters?.clientId) {
      conditions.push(eq(ordersTable.clientId, filters.clientId))
    }

    if (filters?.startDate) {
      conditions.push(gte(ordersTable.orderDate, filters.startDate))
    }

    if (filters?.endDate) {
      conditions.push(lte(ordersTable.orderDate, filters.endDate))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [orders, totalResult] = await Promise.all([
      whereClause
        ? db.select().from(ordersTable).where(whereClause).limit(limit).offset(offset)
        : db.select().from(ordersTable).limit(limit).offset(offset),
      whereClause
        ? db.select({ count: count() }).from(ordersTable).where(whereClause)
        : db.select({ count: count() }).from(ordersTable),
    ])

    const total = totalResult[0].count
    const totalPages = Math.ceil(total / limit)

    return {
      data: orders.map((order) => ({
        id: order.id,
        clientId: order.clientId,
        status: order.status,
        orderDate: order.orderDate,
        total: parseFloat(order.total),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async updateStatus(
    id: string,
    status: UpdateOrderStatusDTO['status'],
  ): Promise<OrderResponseDTO | null> {
    const [order] = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning()

    if (!order) return null

    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      orderDate: order.orderDate,
      total: parseFloat(order.total),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  async updateTotal(id: string): Promise<void> {
    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id))

    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal)
    }, 0)

    await db
      .update(ordersTable)
      .set({ total: total.toString(), updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(ordersTable)
      .where(eq(ordersTable.id, id))
      .returning()

    return result.length > 0
  }
}
