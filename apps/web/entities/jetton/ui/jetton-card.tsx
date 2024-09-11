import { toShortAddress } from '@/entities/address'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/shared/ui/card'
import { GlobeIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface JettonCardProps {
  jetton: any
}

const ICON_MAP = {
  twitter: TwitterIcon,
  telegram: InstagramIcon,
  website: GlobeIcon,
}

const ENABLE_BADGE = false

export const JettonCard: FC<JettonCardProps> = ({ jetton: { name, symbol, description, meta, image, minter } }) => {
  return (
    <Card className="max-w-[345px] relative overflow-hidden">
      <Image src={image ?? ''} alt="Jetton Logo" width={345} height={242} priority />
      <CardContent className="p-6 space-y-2">
        <div className="flex justify-between items-center gap-2">
          <CardDescription>
            Created by: <Link href="#">{toShortAddress(minter)}</Link>
          </CardDescription>
          <CardDescription className="flex gap-1">
            {Object.entries(meta)
              .filter(([key]) => !['id', 'jettonId'].includes(key))
              .map(([key, value]) => {
                const Icon = ICON_MAP[key as keyof typeof ICON_MAP]

                return (
                  <Link key={key} href={value as string}>
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
          </CardDescription>
        </div>
        <CardTitle>
          {name} ($ {symbol})
        </CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <CardDescription>Market Cap: $0.00</CardDescription>
      </CardFooter>

      {ENABLE_BADGE && (
        <div className="absolute right-0 top-0 h-16 w-16">
          <Badge variant="destructive" className="absolute -left-8 top-8 w-32">
            {`$0.00 / $0.00`}
          </Badge>
        </div>
      )}
    </Card>
  )
}
