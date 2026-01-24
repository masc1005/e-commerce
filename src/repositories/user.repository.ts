import { db } from '@/config/database/connection'
import { usersTable } from '@/config/database/schemas'
import { CreateUserDTO, UpdateUserDTO } from '@/types/user/dto'
import { PaginationParams, PaginatedResponse } from '@/types/common'
import { eq, count } from 'drizzle-orm'

export class UserRepository {
  async create(data: CreateUserDTO & { password: string }) {
    const [user] = await db
      .insert(usersTable)
      .values({
        ...(data.id && { id: data.id }),
        name: data.name,
        email: data.email,
        password: data.password,
        type: data.type || 'client',
      })
      .returning()

    return user
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)

    return user || null
  }

  async findById(id: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1)

    return user || null
  }

  async list(params?: PaginationParams): Promise<PaginatedResponse<typeof usersTable.$inferSelect>> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const offset = (page - 1) * limit

    const [users, totalResult] = await Promise.all([
      db.select().from(usersTable).limit(limit).offset(offset),
      db.select({ count: count() }).from(usersTable),
    ])

    const total = totalResult[0].count
    const totalPages = Math.ceil(total / limit)

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async update(id: string, data: UpdateUserDTO & { password?: string }) {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()

    return user || null
  }

  async delete(id: string) {
    const [user] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning()

    return user || null
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return !!user
  }
}
