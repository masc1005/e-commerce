import { eq } from 'drizzle-orm'
import { db } from '@/config/database/connection'
import { clientsTable } from '@/config/database/schemas'
import type {
  CreateClientDTO,
  UpdateClientDTO,
  ClientResponseDTO,
} from '@/types/client/dto'

export class ClientRepository {
  async create(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const [client] = await db.insert(clientsTable).values(data).returning()

    return client
  }

  async findById(id: string): Promise<ClientResponseDTO | null> {
    const [client] = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.id, id))

    return client || null
  }

  async findByUserId(userId: string): Promise<ClientResponseDTO | null> {
    const [client] = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.userId, userId))

    return client || null
  }

  async list(): Promise<ClientResponseDTO[]> {
    const clients = await db.select().from(clientsTable)

    return clients
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
      .delete(clientsTable)
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
