import { db } from '@/shared/database'

export const GET = async (req: Request, { params }: { params: { address: string } }) => {
  const query = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, params.address),
  })
  return new Response(JSON.stringify({ data: query }), { status: 200 })
}
