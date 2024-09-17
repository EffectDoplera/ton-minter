import { db } from '@/shared/database'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getJettons = cache(async (offset = 0, limit = 20) => {
  const query = await db.query.jettons.findMany({
    limit,
    offset,
    orderBy: (jettons, { desc }) => desc(jettons.id),
    with: {
      meta: true,
    },
  })
  if (!query) notFound()
  return query
})
