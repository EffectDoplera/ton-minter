import { db, jettons, jettonsMeta, NewJettonWithMeta } from '@/shared/database'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getJettons = cache(
  async ({ offset = 0, limit = 20, params = '' }: { offset?: number; limit?: number; params?: string }) => {
    const query = await db.query.jettons.findMany({
      limit,
      offset,
      orderBy: (jettons, { desc }) => desc(jettons.id),
      where: (jettons, { like, or }) =>
        or(like(jettons.address, `${params}%`), like(jettons.name, `${params}%`), like(jettons.symbol, `${params}%`)),
      with: {
        meta: true,
      },
    })
    if (!query) notFound()
    return query
  },
)

export const getJettonById = cache(async (id: string) => {
  const query = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, id),
    with: {
      meta: true,
    },
  })
  if (!query) notFound()
  return query
})

export const getLastMintedJetton = cache(async () => {
  const query = await db.query.jettons.findFirst({
    orderBy: (jettons, { desc }) => desc(jettons.id),
    with: {
      meta: true,
    },
  })
  if (!query) notFound()
  return query
})

export const createJetton = async (jetton: NewJettonWithMeta) => {
  const existingJetton = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, jetton.address),
  })

  if (existingJetton) return { error: 'Jetton already exists' }

  const data = await db.transaction(async (tx) => {
    const insert = await tx
      .insert(jettons)
      .values({
        address: jetton.address,
        name: jetton.name,
        symbol: jetton.symbol,
        description: jetton.description,
        image: jetton.image,
        minter: jetton.minter,
      })
      .returning()

    const id = insert[0]!.id

    await tx.insert(jettonsMeta).values({
      jettonId: id,
      website: jetton.meta.website,
      twitter: jetton.meta.twitter,
      telegram: jetton.meta.telegram,
    })

    return { id }
  })

  return data
}
