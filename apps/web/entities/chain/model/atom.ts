import { LightningBoltIcon, SketchLogoIcon } from '@radix-ui/react-icons'
import { CHAIN } from '@tonconnect/ui'
import { atom } from 'jotai'

export const chainsAtom = atom([
  {
    name: 'mainnet',
    code: CHAIN.MAINNET,
    icon: SketchLogoIcon,
  },
  {
    name: 'testnet',
    code: CHAIN.TESTNET,
    icon: LightningBoltIcon,
  },
])

export const chainAtom = atom('mainnet')

export const isMainnetAtom = atom((get) => get(chainAtom) === 'mainnet')
