import { numeric, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { clientsTable } from './clients.schema'

export const orderStatusEnum = pgEnum('order_status', [
  'received',
  'preparing',
  'dispatched',
  'delivered',
])

export const ordersTable = pgTable('orders', {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clientsTable.id, { onDelete: 'cascade' }),
  status: orderStatusEnum().notNull().default('received'),
  orderDate: timestamp().notNull().defaultNow(),
  total: numeric({ precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})
