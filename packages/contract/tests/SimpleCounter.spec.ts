import { toNano } from '@ton/core'
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import { SimpleCounter } from '../wrappers/SimpleCounter'
import '@ton/test-utils'

describe('SimpleCounter', () => {
  let blockchain: Blockchain
  let deployer: SandboxContract<TreasuryContract>
  let simpleCounter: SandboxContract<SimpleCounter>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    simpleCounter = blockchain.openContract(await SimpleCounter.fromInit(0n))

    deployer = await blockchain.treasury('deployer')

    const deployResult = await simpleCounter.send(
      deployer.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: simpleCounter.address,
      deploy: true,
      success: true,
    })
  })

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and simpleCounter are ready to use
  })
})
