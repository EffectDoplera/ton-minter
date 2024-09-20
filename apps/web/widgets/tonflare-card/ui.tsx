import { JettonCard } from '@/entities/jetton/ui/jetton-card'
import { db } from '@/shared/database'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getLastMintedJetton = cache(async () => {
  const query = await db.query.jettons.findFirst({
    orderBy: (jettons, { asc }) => asc(jettons.id),
    with: {
      meta: true,
    },
  })
  if (!query) notFound()
  return query
})

export const TonflareCard = async () => {
  const query = await getLastMintedJetton()

  return (
    <>
      <div className="grid place-content-center p-2.5 -ml-2.5 text-xl text-background font-semibold bg-[url('/badge.png')] bg-no-repeat bg-center bg-cover rounded-sm">
        Tonflare: Illuminate the Peak
      </div>
      <JettonCard jetton={query} />
    </>
  )
}
