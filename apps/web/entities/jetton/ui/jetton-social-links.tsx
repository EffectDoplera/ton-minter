import { GlobeIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface JettonSocialLinksProps {
  links: Record<string, string>[]
}

const ICON_MAP = {
  twitter: TwitterIcon,
  telegram: InstagramIcon,
  website: GlobeIcon,
}

export const JettonSocialLinks: React.FC<JettonSocialLinksProps> = ({ links }) => {
  return (
    <>
      {links.map(({ name, url }) => {
        const Icon = ICON_MAP[name as keyof typeof ICON_MAP]

        return (
          <Link key={name} href={url as string} target="_blank">
            <Icon className="w-4 h-4" />
          </Link>
        )
      })}
    </>
  )
}
