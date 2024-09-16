import { JettonPreview } from '@/entities/jetton'
import { db } from '@/shared/database'
import { Card } from '@/shared/ui/card'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getJettonById = cache(async (id: string) => {
  const query = await db.query.jettons.findFirst({
    where: ({ address }, { eq }) => eq(address, id),
    with: {
      meta: true,
    },
  })
  if (!query) notFound()
  return query
})

const JettonPage = async ({ params }: { params: { address: string } }) => {
  const data = await getJettonById(params.address)
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 justify-center">
      <JettonPreview jetton={data} />
      <Card className="h-96 grid place-content-center md:col-span-8">CHART</Card>
      <Card className="h-96 grid place-content-center md:col-span-4">TRADE</Card>
    </div>
  )
}

export default JettonPage
