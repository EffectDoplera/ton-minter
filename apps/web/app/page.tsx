import { getJettons, JettonCard } from '@/entities/jetton'
import { LoadMore } from '@/features/load-more'
import { SearchBar } from '@/features/search-for-jetton'

const PAGE_SIZE = 5
const OFFSET = 0

async function loadMoreJettons(offset: number = OFFSET, limit: number = PAGE_SIZE) {
  'use server'
  const jettons = await getJettons(offset, limit)

  const nextOffset = jettons.length >= PAGE_SIZE ? PAGE_SIZE + OFFSET : null

  return [jettons.map((jetton) => <JettonCard key={jetton.id} jetton={jetton} />), nextOffset] as const
}

const ENABLE_SEARCH = false

export default async function Home() {
  const initialJettons = await getJettons(0, 5)

  return (
    <>
      <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        TONPUMP
      </h1>
      {ENABLE_SEARCH && <SearchBar />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
        <LoadMore action={loadMoreJettons} initialOffset={5}>
          {initialJettons.map((jetton) => (
            <JettonCard key={jetton.id} jetton={jetton} />
          ))}
        </LoadMore>
      </div>
    </>
  )
}
