import { integer, numeric, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { ordersTable } from './orders.schema'
import { productsTable } from './products.schema'

export const orderItemsTable = pgTable('order_items', {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .notNull()
    .references(() => ordersTable.id, { onDelete: 'cascade' }),
  productId: uuid()
    .notNull()
    .references(() => productsTable.id, { onDelete: 'restrict' }),
  quantity: integer().notNull(),
  unitPrice: numeric({ precision: 10, scale: 2 }).notNull(),
  subtotal: numeric({ precision: 10, scale: 2 })
    .notNull()
    .generatedAlwaysAs(sql`quantity * unit_price`),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})
