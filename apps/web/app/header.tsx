import { MainNav } from '@/app/main-nav'
import { MobileNav } from '@/app/mobile-nav'
import { TonConnectButton } from '@/features/connect-wallet'
import { SearchByAddresForm } from '@/features/search-by-address'
import { SelectChainButton } from '@/features/select-chain'
import { ChainIndicator } from '@/widgets/chain-indicator'
import Image from 'next/image'
import Link from 'next/link'

const ENABLE_SEARCH_BY_ADDRESS = false

export const Header = () => {
  return (
    <header className="p-4 sticky z-30 inset-0 bg-slate-800 flex flex-col gap-4 rounded-b-3xl">
      <div className="flex items-center justify-between">
        <Link className="flex justify-between gap-1" href="/">
          <Image src="/toncoin-ton-logo.svg" alt="toncoin logo" width={30} height={30} priority />
          <p className="text-2xl font-bold uppercase text-white hidden sm:block">Ton Minter</p>
        </Link>
        <MainNav />
        <MobileNav />
        <div className="hidden md:flex justify-between gap-1">
          <ChainIndicator />
          <SelectChainButton />
          <TonConnectButton />
        </div>
      </div>

      {ENABLE_SEARCH_BY_ADDRESS && <SearchByAddresForm />}
    </header>
  )
}
