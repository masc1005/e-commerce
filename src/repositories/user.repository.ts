import { db } from '@/config/database/connection'
import { usersTable } from '@/config/database/schemas'
import { CreateUserDTO, UpdateUserDTO } from '@/types/user/dto'
import { eq } from 'drizzle-orm'

export class UserRepository {
  async create(data: CreateUserDTO & { password: string }) {
    const [user] = await db
      .insert(usersTable)
      .values({
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

  async list() {
    const users = await db.select().from(usersTable)

    return users
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
