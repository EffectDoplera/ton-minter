import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const jettons = sqliteTable('jettons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  address: text('address').notNull(),
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  description: text('description'),
  image: text('image'),
  minter: text('minter').notNull().default(''),
})

export const jettonsRelations = relations(jettons, ({ one }) => ({
  meta: one(jettonsMeta),
}))

export const jettonsMeta = sqliteTable('jettons_meta', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jettonId: integer('jetton_id')
    .notNull()
    .references(() => jettons.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  website: text('website'),
  twitter: text('twitter'),
  telegram: text('telegram'),
})

export const jettonsMetaRelations = relations(jettonsMeta, ({ one }) => ({
  jetton: one(jettons, {
    fields: [jettonsMeta.jettonId],
    references: [jettons.id],
  }),
}))
