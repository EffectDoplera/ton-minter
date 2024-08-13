'use client'

import { Address, beginCell, Sender, SenderArguments, storeStateInit } from '@ton/ton'
import { ITonConnect } from '@tonconnect/ui'
import { useEffect, useState } from 'react'
import { useTonConnectUI } from './use-ton-connect-ui'

class TonConnectSender implements Sender {
  public provider: ITonConnect
  readonly address?: Address

  constructor(provider: ITonConnect) {
    this.provider = provider
    if (provider.wallet) this.address = Address.parse(provider.wallet.account.address)
  }

  async send(args: SenderArguments): Promise<void> {
    await this.provider.sendTransaction({
      validUntil: Date.now() + 5 * 60 * 1000,
      messages: [
        {
          address: args.to.toString(),
          amount: args.value.toString(),
          payload: args.body?.toBoc().toString('base64'),
          stateInit: args.init
            ? beginCell().storeWritable(storeStateInit(args.init)).endCell().toBoc().toString('base64')
            : undefined,
        },
      ],
    })
  }
}

export const useTonSender = () => {
  const [tonConnector] = useTonConnectUI()
  const [tonSender, setTonSender] = useState<TonConnectSender | null>(null)

  useEffect(() => {
    if (tonConnector.connector) {
      setTonSender(new TonConnectSender(tonConnector.connector))
    }
  }, [tonConnector])

  return tonSender
}
