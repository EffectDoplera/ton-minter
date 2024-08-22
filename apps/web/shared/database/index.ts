import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const client = createClient({
  url: process.env.DB_CONNECTION_URL!,
})

export const db = drizzle(client, { schema })

export * from './schema'
