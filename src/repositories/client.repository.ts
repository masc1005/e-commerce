import { eq, and, count } from 'drizzle-orm'
import { db } from '@/config/database/connection'
import { clientsTable } from '@/config/database/schemas'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import type {
  CreateClientDTO,
  UpdateClientDTO,
  ClientResponseDTO,
} from '@/types/client/dto'

export class ClientRepository {
  async create(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const [client] = await db
      .insert(clientsTable)
      .values({
        ...(data.id && { id: data.id }),
        userId: data.userId,
        name: data.name,
        contact: data.contact,
        address: data.address,
        status: data.status || 'active',
      })
      .returning()

    return client
  }

  async findById(id: string): Promise<ClientResponseDTO | null> {
    const [client] = await db
      .select()
      .from(clientsTable)
      .where(and(eq(clientsTable.id, id), eq(clientsTable.status, 'active')))

    return client || null
  }

  async findByUserId(userId: string): Promise<ClientResponseDTO | null> {
    const [client] = await db
      .select()
      .from(clientsTable)
      .where(
        and(eq(clientsTable.userId, userId), eq(clientsTable.status, 'active')),
      )

    return client || null
  }

  async list(params?: PaginationParams): Promise<PaginatedResponse<ClientResponseDTO>> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const offset = (page - 1) * limit

    const [clients, totalResult] = await Promise.all([
      db
        .select()
        .from(clientsTable)
        .where(eq(clientsTable.status, 'active'))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(clientsTable)
        .where(eq(clientsTable.status, 'active')),
    ])

    const total = totalResult[0].count
    const totalPages = Math.ceil(total / limit)

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async update(
    id: string,
    data: UpdateClientDTO,
  ): Promise<ClientResponseDTO | null> {
    const [client] = await db
      .update(clientsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clientsTable.id, id))
      .returning()

    return client || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .update(clientsTable)
      .set({ status: 'inactive' })
      .where(eq(clientsTable.id, id))
      .returning()

    return result.length > 0
  }

  async exists(id: string): Promise<boolean> {
    const [client] = await db
      .select({ id: clientsTable.id })
      .from(clientsTable)
      .where(eq(clientsTable.id, id))

    return !!client
  }
}
