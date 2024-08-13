'use client'

import { useTonWallet } from '@/features/connect-wallet'
import { MintJettonForm } from '@/features/mint-jetton'
import { getHttpV4Endpoint } from '@orbs-network/ton-access'
import { Address, JettonMaster, JettonWallet, TonClient4 } from '@ton/ton'
import { CHAIN } from '@tonconnect/ui'
import { useEffect } from 'react'

export default function Home() {
  const wallet = useTonWallet()

  useEffect(() => {
    const chain = wallet?.account.chain
    const chainName = CHAIN.MAINNET === chain ? 'mainnet' : 'testnet'

    getHttpV4Endpoint({ network: chainName })
      .then((endpoint) => {
        return new TonClient4({ endpoint })
      })
      .then(async (client) => {
        const jettonMaster = JettonMaster.create(Address.parse('EQC_LprjiutdEXJw11e4lK76FwRJgGOVO6DMOH-gnLo8byxH'))

        const jettonMasterContract = client.open(jettonMaster)

        const { totalSupply, mintable, adminAddress, content, walletCode } = await jettonMasterContract.getJettonData()

        const walletAddress = await jettonMasterContract.getWalletAddress(adminAddress)

        const jettonWallet = JettonWallet.create(walletAddress)

        const walletContract = client.open(jettonWallet)

        const balance = await walletContract.getBalance()

        console.log({ totalSupply, mintable, adminAddress, content, walletCode, walletAddress, balance })
      })
  }, [wallet])

  return (
    <main className="flex flex-col items-center container">
      <MintJettonForm />
    </main>
  )
}
