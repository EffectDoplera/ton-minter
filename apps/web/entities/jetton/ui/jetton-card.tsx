import { MinterAddress } from '@/entities/minter'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/shared/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { getSocialLinks } from '../lib'
import { JettonWithMeta } from '../model'
import { JettonSocialLinks } from './jetton-social-links'

interface JettonCardProps {
  jetton: JettonWithMeta
}

const ENABLE_BADGE = false

export const JettonCard: FC<JettonCardProps> = ({
  jetton: { name, symbol, address, description, meta, image, minter },
}) => {
  const socialLinks = getSocialLinks(meta)

  return (
    <Card className="relative overflow-hidden">
      <Image
        src={image || 'https://cdn.sunpump.meme/public/logo/GOKU_TEW71u_O1eiYMiRWcrt.jpeg'}
        alt="Jetton Logo"
        width={345}
        height={242}
        className="w-full"
      />
      <CardContent className="p-6 space-y-2">
        <div className="flex justify-between items-center gap-2 relative">
          <MinterAddress address={minter} className="z-50" />
          <div className="flex gap-1 text-sm text-muted-foreground absolute right-0 z-50">
            <JettonSocialLinks links={socialLinks} />
          </div>
        </div>
        <CardTitle className="pt-2">
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
      <Link className="absolute inset-0 w-full" href={`/jetton/${address}`} />
    </Card>
  )
}
