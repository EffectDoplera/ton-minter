'use client'

import { useTonWallet } from '@/features/connect-wallet'
import { MintJettonForm } from '@/features/mint-jetton'
import { getHttpV4Endpoint } from '@orbs-network/ton-access'
import { Address, JettonMaster, JettonWallet, TonClient4 } from '@ton/ton'
import { CHAIN } from '@tonconnect/ui'
import { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../shared/ui/card'

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
    <main className="grid grid-cols-2 gap-4 p-4">
      <MintJettonForm />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">This is an open source tool</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>
            Jetton is the fungible token standard for TON blockchain. This free educational tool allows you to deploy
            your own Jetton to mainnet in one click. You will need at least 0.25 TON for deployment fees.
          </p>

          <p>
            For detailed instructions and in-depth explanations of all fields please see the GitHub README. It includes
            several best practice recommendations so please take a look.
          </p>

          <p>
            Never deploy code that you've never seen before! This deployer is fully open source with all smart contract
            code available here. The HTML form is also open source and served from GitHub Pages.
          </p>

          <p>Is this deployer safe? Yes! Read this to understand why.</p>
        </CardContent>

        <CardFooter>GitHub Repo</CardFooter>
      </Card>
    </main>
  )
}
