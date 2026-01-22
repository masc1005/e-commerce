import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { usersTable } from './users.schema'

export const statusEnum = pgEnum('status_client', ['active', 'inactive'])

export const clientsTable = pgTable('clients', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar().notNull(),
  contact: varchar().notNull(),
  address: varchar(),
  status: statusEnum().notNull().default('active'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})
