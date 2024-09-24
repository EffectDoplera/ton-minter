'use client'

import { useTonClient } from '@/features/connect-wallet'
import {
  bufferToStr,
  decodeImage,
  decodeSimpleFields,
  DefaultContentResolver,
  loadFullContent,
} from '@indieverse/ton-content'
import { useQuery } from '@tanstack/react-query'
import { Address, JettonMaster, JettonWallet } from '@ton/ton'

export const useJettonWallet = (params: any) => {
  const client = useTonClient()

  return useQuery({
    queryKey: ['jetton', params.address],
    queryFn: async () => {
      if (client) {
        const jettonMaster = JettonMaster.create(Address.parse(params.address))

        console.log(jettonMaster)
        const jettonMasterContract = client.open(jettonMaster)

        console.log(jettonMasterContract)

        const { totalSupply, mintable, adminAddress, content } = await jettonMasterContract.getJettonData()

        console.log({ totalSupply, mintable, adminAddress, content })

        const walletAddress = await jettonMasterContract.getWalletAddress(adminAddress)

        const jettonWallet = JettonWallet.create(walletAddress)

        const walletContract = client.open(jettonWallet)

        const balance = await walletContract.getBalance()

        const decodedContent = await loadFullContent(content, DefaultContentResolver as any)
        const imageURI = decodeImage(decodedContent)
        const metadata = decodeSimpleFields(decodedContent, {
          name: {
            onchain: bufferToStr,
            offchain: () => {
              throw new Error('offchain does not support')
            },
          },
          symbol: {
            onchain: bufferToStr,
            offchain: () => {
              throw new Error('offchain does not support')
            },
          },
          decimals: {
            onchain: bufferToStr,
            offchain: () => {
              throw new Error('offchain does not support')
            },
          },
        })

        console.log({ totalSupply, mintable, adminAddress, walletAddress, balance, imageURI, metadata })

        return {
          totalSupply,
          mintable,
          adminAddress,
          walletAddress,
          balance,
          imageURI,
          metadata,
        }
      }
    },

    enabled: !!client,
  })
}
