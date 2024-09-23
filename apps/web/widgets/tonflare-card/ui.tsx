import { JettonCard } from '@/entities/jetton/ui/jetton-card'
import { db } from '@/shared/database'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getLastMintedJetton = cache(async () => {
  const query = await db.query.jettons.findFirst({
    orderBy: (jettons, { desc }) => desc(jettons.id),
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
      <div className="grid place-content-center p-2.5 pl-10 text-l text-background font-semibold bg-[url('/badge.png')] bg-no-repeat bg-left bg-cover rounded-xl">
        Tonflare: Illuminate the Peak
      </div>
      <JettonCard jetton={query} />
    </>
  )
}
