import { getJettons, JettonCard } from '@/entities/jetton'
import { LoadMore } from '@/features/load-more'
import { SearchBar } from '@/features/search-for-jetton'
import { TonflareCard } from '@/widgets/tonflare-card'

const PAGE_SIZE = 5
const OFFSET = 0

async function loadMoreJettons({ offset = OFFSET, limit = PAGE_SIZE, params = '' }: Parameters<typeof getJettons>[0]) {
  'use server'
  const jettons = await getJettons({ offset, limit, params })

  const nextOffset = jettons.length >= PAGE_SIZE ? PAGE_SIZE + OFFSET : null

  return [jettons.map((jetton) => <JettonCard key={jetton.id} jetton={jetton} />), nextOffset] as const
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export default async function Home(props: Props) {
  const initialJettons = await getJettons({ offset: OFFSET, limit: PAGE_SIZE, params: props.searchParams.query })

  return (
    <>
      <div className="grid md:grid-cols-4 gap-2">
        <div className="col-start-1 col-end-3 grid place-content-center">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
            TONPUMP
          </h1>
          <p className="text-3xl font-bold text-center">
            The First Meme Fair Launch Platform on TON. PUMP TO THE SPACE
          </p>
        </div>
        <div className="col-span-2 grid place-content-center md:content-center md:justify-end">
          <TonflareCard />
        </div>
      </div>
      <SearchBar />
      <div className="grid grid-cols-[repeat(auto-fill,345px)] gap-4 place-content-center">
        <LoadMore action={loadMoreJettons} initialOffset={5}>
          {initialJettons.map((jetton) => (
            <JettonCard key={jetton.id} jetton={jetton} />
          ))}
        </LoadMore>
      </div>
    </>
  )
}
