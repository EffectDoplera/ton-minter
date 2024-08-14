'use client'

import { fromNano } from '@ton/ton'
import Image from 'next/image'
import { useJettonWallet } from './use-jetton-wallet'

export default function JettonPage({ params }: { params: { address: string } }) {
  const { data, isLoading } = useJettonWallet(params)

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-4">
      <div className="text-xl flex flex-row items-center gap-2 ">
        {data?.imageURI && <Image src={data.imageURI as string} alt="NFT" width={200} height={200} priority></Image>}
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Address:</p>
        <p className="truncate min-w-content">{params.address}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Admin:</p>
        <p className="truncate min-w-content">{data?.adminAddress.toString()}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Mintable:</p>
        <p className="truncate min-w-content">{data?.mintable && 'true'}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Symbol:</p>
        <p className="truncate min-w-content">{data?.metadata.symbol}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Total Supply:</p>
        <p className="truncate min-w-content">
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0,
          }).format(+fromNano(data?.totalSupply || 0))}
        </p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Wallet Address:</p>
        <p className="truncate min-w-content">{data?.walletAddress.toString()}</p>
      </div>

      <div className="text-xl flex flex-row items-center gap-2 ">
        <p className="font-bold flex-shrink-0">Wallet Balance:</p>
        <p className="truncate min-w-content">
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0,
          }).format(+fromNano(data?.balance || 0))}
        </p>
      </div>
    </div>
  )
}
