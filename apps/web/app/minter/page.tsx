import {
  bufferToStr,
  decodeImage,
  decodeSimpleFields,
  DefaultContentResolver,
  loadFullContent,
} from '@indieverse/ton-content'
import { getHttpEndpoint } from '@orbs-network/ton-access'
import { Address, fromNano, JettonMaster, JettonWallet, TonClient } from '@ton/ton'
import Image from 'next/image'

export default async function Minter() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' })

  const client = new TonClient({ endpoint })

  const jettonMaster = JettonMaster.create(Address.parse('EQAf1Dp-Jk2Y4gxnxUC84jupoVaROkainHk6WjMHKkDezYhO'))

  const jettonMasterContract = client.open(jettonMaster)

  const { totalSupply, mintable, adminAddress, content, walletCode } = await jettonMasterContract.getJettonData()

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

  return (
    <>
      <div className="text-3xl">Minter</div>
      <div className="text-xl flex flex-row items-center gap-2 ">
        <Image src={imageURI as string} alt="NFT" width={200} height={200}></Image>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Address:</p>
        <p className="truncate min-w-content">{jettonMasterContract.address.toString()}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Admin:</p>
        <p className="truncate min-w-content">{adminAddress.toString()}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Mintable:</p>
        <p className="truncate min-w-content">{mintable && 'true'}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Symbol:</p>
        <p className="truncate min-w-content">{metadata.symbol}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Total Supply:</p>
        <p className="truncate min-w-content">
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0,
          }).format(+fromNano(totalSupply))}
        </p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Wallet Address:</p>
        <p className="truncate min-w-content">{walletAddress.toString()}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Wallet Balance:</p>
        <p className="truncate min-w-content">
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0,
          }).format(+fromNano(balance))}
        </p>
      </div>
    </>
  )
}
