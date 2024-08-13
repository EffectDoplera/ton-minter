'use client'

import { useTonClient, useTonSender, useTonWallet } from '@/features/connect-wallet'
import { JettonMasterImpl as JettonMaster } from '@repo/contract/JettonMaster'
import { buildJettonContent, JettonContent } from '@repo/contract/utils'
import { Address, beginCell, toNano, TonClient4 } from '@ton/ton'
import { useEffect, useState } from 'react'

class NetworkProvider {
  #tc: TonClient4
  constructor(tc: TonClient4) {
    this.#tc = tc
  }

  async isContractDeployed(address: Address): Promise<boolean> {
    return this.#tc.isContractDeployed((await this.#tc.getLastBlock()).last.seqno, address)
  }

  async waitForDeploy(address: Address, attempts: number = 10, sleepDuration: number = 2000) {
    if (attempts <= 0) {
      throw new Error('Attempt number must be positive')
    }

    for (let i = 1; i <= attempts; i++) {
      const isDeployed = await this.isContractDeployed(address)
      if (isDeployed) {
        return
      }
      await sleep(sleepDuration)
    }

    throw new Error("Contract was not deployed. Check your wallet's transactions")
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const useMintJetton = () => {
  const wallet = useTonWallet()
  const sender = useTonSender()
  const [minter, setMinter] = useState<Function | null>(null)
  const client = useTonClient()

  useEffect(() => {
    if (client && wallet && sender) {
      setMinter(() => async (data: JettonContent & { amount: string }) => {
        const provider = new NetworkProvider(client)
        const { amount, ...jettonData } = data
        const content = buildJettonContent(jettonData)
        const jettonMaster = await JettonMaster.fromInit(Address.parse(wallet.account.address), content)

        const jettonMasterContract = client.open(jettonMaster)

        await jettonMasterContract.send(
          sender,
          {
            value: toNano('0.1'),
          },
          {
            $$type: 'Deploy',
            queryId: 0n,
          },
        )

        await provider.waitForDeploy(jettonMaster.address)

        await jettonMasterContract.send(
          sender,
          {
            value: toNano('0.1'),
          },
          {
            $$type: 'JettonMint',
            origin: Address.parse(wallet!.account.address),
            receiver: Address.parse(wallet!.account.address),
            amount: toNano(amount),
            custom_payload: beginCell().endCell(),
            forward_ton_amount: toNano(0),
            forward_payload: beginCell().endCell(),
          },
        )
      })
    }
  }, [client, wallet, sender])

  return minter
}
