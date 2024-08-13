'use client'

import { Network } from '@orbs-network/ton-access'
import { CHAIN } from '@tonconnect/ui'
import { useTonWallet } from './use-ton-wallet'

export const useTonChain = () => {
  const wallet = useTonWallet()
  return (CHAIN.MAINNET === wallet?.account.chain ? 'mainnet' : 'testnet') satisfies Network
}
