import { db, jettons } from '@/shared/database'

export const POST = async (req: Request) => {
  const body = await req.json()

  const jetton = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, body.address),
  })

  if (jetton) return new Response(JSON.stringify({ error: 'Jetton already exists' }), { status: 400 })

  await db.insert(jettons).values({
    address: body.address,
  })

  return new Response(JSON.stringify({ data: 'Jetton created' }), { status: 200 })
}
