import { integer, numeric, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { ordersTable } from './orders.schema'
import { productsTable } from './products.schema'

export const orderItemsTable = pgTable('order_items', {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => ordersTable.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => productsTable.id, { onDelete: 'restrict' }),
  quantity: integer().notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric({ precision: 10, scale: 2 })
    .notNull()
    .generatedAlwaysAs(sql`quantity * unit_price`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
})
