'use client'

import { useTonConnectModal, useTonWallet } from '@/features/connect-wallet'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const MobileNav = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const path = usePathname()
  const wallet = useTonWallet()
  const { open } = useTonConnectModal()

  useEffect(() => {
    setOpenSheet(false)
  }, [path])

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon color="white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-full">
        <SheetHeader>
          <SheetTitle className="text-3xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
            TONPUMP
          </SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col flex-1">
          <li>
            <Link href="/" className="py-4 block">
              Home
            </Link>
          </li>
          <li>
            <Link href="/create-jetton" className="py-4 block">
              Launch
            </Link>
          </li>
        </ul>
        {!wallet && (
          <Button type="button" onClick={open}>
            Connect wallet
          </Button>
        )}
      </SheetContent>
    </Sheet>
  )
}
