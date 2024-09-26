import { getLastMintedJetton } from '@/entities/jetton/api'
import { JettonCard } from '@/entities/jetton/ui/jetton-card'

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
