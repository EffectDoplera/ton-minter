import { MinterAddress } from '@/entities/minter'
import { Card, CardContent, CardDescription, CardTitle } from '@/shared/ui/card'
import Image from 'next/image'
import { getSocialLinks } from '../lib'
import { JettonWithMeta } from '../model'
import { JettonSocialLinks } from './jetton-social-links'

interface JettonPreviewProps {
  jetton: JettonWithMeta
}

const ENABLE_MARKET_CAP = false

export const JettonPreview: React.FC<JettonPreviewProps> = ({
  jetton: { name, symbol, description, meta, image, minter },
}) => {
  const socialLinks = getSocialLinks(meta)
  return (
    <Card className="col-span-full p-4 flex flex-col justify-between gap-4">
      <CardContent className="p-0">
        <div className="flex justify-between gap-2">
          <div className="flex justify-between gap-2">
            <Image
              src={image || 'https://cdn.sunpump.meme/public/logo/GOKU_TEW71u_O1eiYMiRWcrt.jpeg'}
              alt="Jetton Logo"
              width={60}
              height={80}
              className="w-full h-full"
            />
            <div className="flex flex-col gap-2 justify-between">
              <p>{name}</p>
              <CardTitle>($ {symbol})</CardTitle>
              <MinterAddress address={minter} />
              <CardDescription className="line-clamp-3">{description}</CardDescription>
            </div>
          </div>

          <div className="flex gap-1 text-sm text-muted-foreground">
            <JettonSocialLinks links={socialLinks} />
          </div>
        </div>
      </CardContent>

      {ENABLE_MARKET_CAP && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">PRICE</Card>

          <Card className="text-center">Marketcap</Card>

          <Card className="text-center">Virtual Liquidity</Card>
        </div>
      )}
    </Card>
  )
}
