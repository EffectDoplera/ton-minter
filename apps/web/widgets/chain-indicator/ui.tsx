import { isMainnetAtom } from '@/entities/chain'
import { Badge } from '@/shared/ui/badge'
import { useAtom } from 'jotai'

export const ChainIndicator = () => {
  const [isMainnet] = useAtom(isMainnetAtom)

  if (isMainnet) return null

  return (
    <Badge variant="destructive" className="capitalize self-center">
      testnet
    </Badge>
  )
}
