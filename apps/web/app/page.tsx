import { JettonCard } from '@/entities/jetton'
import { db } from '@/shared/database'
import Link from 'next/link'

const getJettons = async () => {
  const query = await db.query.jettons.findMany({
    orderBy: (jettons, { desc }) => desc(jettons.id),
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
      <div className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        TONPUMP
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
        {data.map((jetton) => (
          <Link key={jetton.id} href={`/jetton/${jetton.address}`}>
            <JettonCard jetton={jetton} />
          </Link>
        ))}
      </div>
    </>
  )
}
