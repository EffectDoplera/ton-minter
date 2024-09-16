import { toShortAddress } from '@/entities/address'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/shared/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { getSocialLinks } from '../lib'
import { JettonSocialLinks } from './jetton-social-links'

interface JettonCardProps {
  jetton: any
}

const ENABLE_BADGE = false

export const JettonCard: FC<JettonCardProps> = ({ jetton: { name, symbol, description, meta, image, minter } }) => {
  const socialLinks = getSocialLinks(meta)

  return (
    <Card className="relative overflow-hidden">
      <Image
        src={image || 'https://cdn.sunpump.meme/public/logo/GOKU_TEW71u_O1eiYMiRWcrt.jpeg'}
        alt="Jetton Logo"
        width={345}
        height={242}
        className="w-full h-full"
      />
      <CardContent className="p-6 space-y-2">
        <div className="flex justify-between items-center gap-2">
          <CardDescription>
            Created by: <Link href="#">{toShortAddress(minter)}</Link>
          </CardDescription>
          <CardDescription className="flex gap-1">
            <JettonSocialLinks links={socialLinks} />
          </CardDescription>
        </div>
        <CardTitle>
          {name} ($ {symbol})
        </CardTitle>
        <CardDescription className="line-clamp-3 min-h-4">{description}</CardDescription>
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
