import { getHttpV4Endpoint } from '@orbs-network/ton-access'
import { SimpleCounter } from '@repo/contract/SimpleCounter'
import { Address, TonClient4 } from '@ton/ton'
import Image from 'next/image'
import styles from './page.module.css'

const counterAddress = 'EQApvaV6zWC3U5lkHogHMWORX4_AlMJdeK9I_i93MSbs4uzV'

export default async function Home() {
  const counterValue = await getHttpV4Endpoint({ network: 'testnet' })
    .then((endpoint) => {
      console.log(endpoint)
      return new TonClient4({ endpoint })
    })
    .then((client) => {
      return client.open(SimpleCounter.fromAddress(Address.parse(counterAddress)))
    })
    .then(async (contract) => {
      return {
        value: await contract.getCounter(),
        id: await contract.getId(),
      }
    })
    .then((data) => {
      return {
        value: data.value.toString(),
        id: data.id.toString(),
      }
    })
    .catch(() => {
      return null
    })

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <div className="text-xl flex flex-row items-center gap-2 ">
          <p className="font-bold flex-shrink-0">Address of counter:</p>
          <p className="truncate min-w-content">{counterAddress}</p>
        </div>

        <div className="text-xl flex flex-row items-center gap-2 ">
          <p className="font-bold flex-shrink-0">Counter ID:</p>
          <p className="truncate min-w-content">{counterValue?.id ?? '0'}</p>
        </div>

        <div className="text-xl flex flex-row items-center gap-2 ">
          <p className="font-bold flex-shrink-0">Counter value:</p>
          <p className="truncate min-w-content">{counterValue?.value ?? '0'}</p>
        </div>
      </main>
    </div>
  )
}
