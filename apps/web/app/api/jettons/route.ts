import { db, jettons, jettonsMeta } from '@/shared/database'
import { revalidatePath } from 'next/cache'

export const POST = async (req: Request) => {
  const body = await req.json()

  const jetton = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, body.address),
  })

  if (jetton) return new Response(JSON.stringify({ error: 'Jetton already exists' }), { status: 400 })

  await db.transaction(async (tx) => {
    const insert = await tx
      .insert(jettons)
      .values({
        address: body.address,
        name: body.name,
        symbol: body.symbol,
        description: body.description,
        image: body.image,
        minter: body.minter,
      })
      .returning()

    const id = insert[0]!.id

    await tx.insert(jettonsMeta).values({
      jettonId: id,
      website: body.meta.website,
      twitter: body.meta.twitter,
      telegram: body.meta.telegram,
    })
  })

  revalidatePath('/')

  return new Response(JSON.stringify({ data: 'Jetton created' }), { status: 200 })
}

export const GET = async () => {
  const query = await db.query.jettons.findMany({
    orderBy: (jettons, { asc }) => asc(jettons.id),
    with: {
      meta: true,
    },
  })
  return new Response(JSON.stringify({ data: query }), { status: 200 })
}
