'use client'

import { useTonConnectModal, useTonWallet } from '@/features/connect-wallet'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export const MobileNav = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const wallet = useTonWallet()
  const { open } = useTonConnectModal()

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon color="white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-full">
        <ul className="flex flex-col flex-1 gap-2">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/create-jetton">Launch</Link>
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
