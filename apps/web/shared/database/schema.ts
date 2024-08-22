import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const jettons = sqliteTable('jettons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  address: text('address').notNull(),
})
