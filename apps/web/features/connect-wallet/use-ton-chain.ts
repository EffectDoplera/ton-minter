'use client'

import { Network } from '@orbs-network/ton-access'
import { CHAIN } from '@tonconnect/ui'
import { useEffect, useState } from 'react'
import { useTonWallet } from './use-ton-wallet'

export const useTonChain = () => {
  const wallet = useTonWallet()
  const [chain, setChain] = useState<Network | null>(null)

  useEffect(() => {
    if (wallet) setChain((CHAIN.MAINNET === wallet?.account.chain ? 'mainnet' : 'testnet') satisfies Network)
  }, [wallet])

  return chain
}
