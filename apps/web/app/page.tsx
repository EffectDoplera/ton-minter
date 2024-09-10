import { JettonCard } from '@/entities/jetton'
import { db } from '@/shared/database'

const getJettons = async () => {
  const query = await db.query.jettons.findMany({
    orderBy: (jettons, { asc }) => asc(jettons.id),
    with: {
      meta: true,
    },
  })
  return query
}

export default async function Home() {
  const data = await getJettons()

  return (
    <>
      <div className="text-3xl font-bold">TonPump</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((jetton) => (
          <JettonCard key={jetton.id} jetton={jetton} />
        ))}
      </div>
    </>
  )
}
