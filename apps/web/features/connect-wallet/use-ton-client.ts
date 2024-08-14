'use client'

import { getHttpV4Endpoint } from '@orbs-network/ton-access'
import { TonClient4 } from '@ton/ton'
import { useEffect, useState } from 'react'
import { useTonChain } from './use-ton-chain'

export const useTonClient = () => {
  const chainName = useTonChain()
  const [client, setClient] = useState<TonClient4 | null>(null)

  useEffect(() => {
    if (chainName)
      getHttpV4Endpoint({ network: chainName }).then((endpoint) => {
        setClient(new TonClient4({ endpoint }))
      })
  }, [chainName])

  return client
}
