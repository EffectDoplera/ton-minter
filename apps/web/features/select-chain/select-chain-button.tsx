'use client'

import { chainAtom, chainsAtom } from '@/entities/chain'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { GearIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'
import { useTonWallet } from '../connect-wallet'

export const SelectChainButton = () => {
  const [chains] = useAtom(chainsAtom)
  const [chain, setChain] = useAtom(chainAtom)
  const wallet = useTonWallet()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-[#0098EA] text-white rounded-full border-none hover:bg-[#0098EA]/80 hover:text-white"
                disabled={!!wallet}
              >
                <GearIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Disconnect current wallet for switch chain</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          {chains.map(({ name, code, icon: Icon }) => (
            <DropdownMenuItem
              key={code}
              className={cn('gap-2 capitalize', chain === name && 'font-bold')}
              onSelect={() => setChain(name)}
            >
              <Icon className="w-4 h-4 fill-current" />
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
