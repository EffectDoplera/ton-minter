import { db, jettons, jettonsMeta } from '@/shared/database'

export const POST = async (req: Request) => {
  const body = await req.json()

  const jetton = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, body.address),
  })

  if (jetton) return new Response(JSON.stringify({ error: 'Jetton already exists' }), { status: 400 })

  const insert = await db
    .insert(jettons)
    .values({
      address: body.address,
      name: body.name,
      symbol: body.symbol,
      description: body.description,
    })
    .returning()

  const id = insert[0]!.id

  await db.insert(jettonsMeta).values({
    jettonId: id,
    website: body.meta.website,
    twitter: body.meta.twitter,
    telegram: body.meta.telegram,
  })

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
