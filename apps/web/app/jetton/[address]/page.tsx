import { JettonPreview } from '@/entities/jetton'
import { db } from '@/shared/database'
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
    <>
      <JettonPreview jetton={data} />
    </>
  )
}

export default JettonPage
