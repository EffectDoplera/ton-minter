import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const jettons = sqliteTable('jettons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  address: text('address').notNull(),
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  description: text('description'),
})

export const jettonsMeta = sqliteTable('jettons_meta', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jettonId: integer('jetton_id')
    .notNull()
    .references(() => jettons.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  website: text('website'),
  twitter: text('twitter'),
  telegram: text('telegram'),
})
