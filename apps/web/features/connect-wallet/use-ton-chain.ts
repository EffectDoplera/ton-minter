'use client'

import { chainAtom } from '@/entities/chain'
import { Network } from '@orbs-network/ton-access'
import { CHAIN } from '@tonconnect/ui'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useTonWallet } from './use-ton-wallet'

export const useTonChain = () => {
  const wallet = useTonWallet()
  const [chain, setChain] = useAtom(chainAtom)

  useEffect(() => {
    if (wallet) setChain(CHAIN.MAINNET === wallet?.account.chain ? 'mainnet' : 'testnet')
  }, [wallet, chain])

  return chain as Network
}
