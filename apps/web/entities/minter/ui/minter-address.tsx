import { toShortAddress } from '@/entities/address'
import { cn } from '@/shared/lib/utils'
import Link from 'next/link'

interface MinterAddressProps {
  address: string
  className?: string
}

export const MinterAddress: React.FC<MinterAddressProps> = ({ address, className }) => {
  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      Created by:{' '}
      <Link href={`https://testnet.tonviewer.com/${address}`} target="_blank">
        {toShortAddress(address)}
      </Link>
    </div>
  )
}
