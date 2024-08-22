import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const jettons = sqliteTable('jettons', {
  id: text('id').notNull().primaryKey(),
  address: text('address').notNull(),
})
