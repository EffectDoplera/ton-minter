import { NetworkProvider } from '@ton/blueprint'
import { beginCell, toNano } from '@ton/core'
import { JettonMasterImpl as JettonMaster } from '../wrappers/Jetton_JettonMaster'
import { buildJettonContent } from '../utils/ton-tep64'

export async function run(provider: NetworkProvider) {
  const deployer = provider.sender()

  console.log('Deploying contract with deployer address', deployer.address)

  const jettonContent = buildJettonContent({
    name: 'FLY',
    description: 'FLY',
    symbol: 'FLY',
    decimals: '9',
    image: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg?v=032',
  })

  const tokenMaster = provider.open(await JettonMaster.fromInit(deployer.address!, jettonContent))

  await tokenMaster.send(
    provider.sender(),
    {
      value: toNano('0.1'),
    },
    {
      $$type: 'Deploy',
      queryId: 89n,
    },
  )

  await provider.waitForDeploy(tokenMaster.address)

  await tokenMaster.send(
    provider.sender(),
    {
      value: toNano('0.5'),
    },
    {
      $$type: 'JettonMint',
      origin: deployer.address!,
      receiver: deployer.address!,
      amount: toNano(10n),
      custom_payload: beginCell().endCell(),
      forward_ton_amount: toNano(0),
      forward_payload: beginCell().endCell(),
    }
  )
}