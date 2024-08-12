import { beginCell, Cell, toNano } from '@ton/core'
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import { JettonMaster } from '../wrappers/JettonMaster'
import { JettonBurn, JettonWallet } from '../wrappers/JettonWallet'
import '@ton/test-utils'

describe('JettonMaster', () => {
  let blockchain: Blockchain
  let owner: SandboxContract<TreasuryContract>
  let alice: SandboxContract<TreasuryContract>
  let jettonMaster: SandboxContract<JettonMaster>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    owner = await blockchain.treasury('owner')
    alice = await blockchain.treasury('alice')
    const jetton_content: Cell = beginCell().endCell()
    jettonMaster = blockchain.openContract(await JettonMaster.fromInit(owner.address, jetton_content))

    const deployResult = await jettonMaster.send(
      owner.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: owner.address,
      to: jettonMaster.address,
      deploy: true,
      success: true,
    })
  })

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and jetton are ready to use
  })

  it('should mint', async () => {
    const mintyResult = await jettonMaster.send(
      alice.getSender(),
      {
        value: toNano('1'),
      },
      {
        $$type: 'JettonTransfer',
        query_id: 5n,
        amount: toNano(1),
        destination: owner.address,
        response_destination: owner.address,
        custom_payload: beginCell().endCell(),
        forward_ton_amount: toNano(1),
        forward_payload: beginCell().storeInt(0, 32).storeStringTail('hello world').endCell().asSlice(),
      },
    )

    expect(mintyResult.transactions).toHaveTransaction({
      from: alice.address,
      to: jettonMaster.address,
      success: true,
    })

    // Check that JettonMaster send 1 token to Alice's jetton wallet
    const aliceWalletAddress = await jettonMaster.getGetWalletAddress(alice.address)
    expect(mintyResult.transactions).toHaveTransaction({
      from: jettonMaster.address,
      to: aliceWalletAddress,
      success: true,
    })

    // Check that Alice's jetton wallet send JettonExcesses msg to Alice
    expect(mintyResult.transactions).toHaveTransaction({
      from: aliceWalletAddress,
      to: alice.address,
      success: true,
    })

    // Check that Alice's jetton wallet balance is 1
    const aliceJettonContract = blockchain.openContract(JettonWallet.fromAddress(aliceWalletAddress))
    const aliceBalanceAfter = (await aliceJettonContract.getGetWalletData()).balance
    expect(aliceBalanceAfter).toEqual(toNano(1))

    // expect((await jettonMaster.getGetJettonData()).total_supply).toEqual(toNano(20))
    // expect((await owner1_wallet.getGetWalletData()).balance).toEqual(toNano(20))

    // owner1_wallet.send(
    //   owner.getSender(),
    //   {
    //     value: toNano('1.2'),
    //   },
    //   {
    //     $$type: 'JettonBurn',
    //     query_id: 144n,
    //     amount: toNano(1),
    //     response_destination: owner.address,
    //     custom_payload: beginCell().endCell(),
    //   },
    // )

    // console.log((await owner1_wallet.getGetWalletData()).balance)

    // expect((await jettonMaster.getGetJettonData()).total_supply).toEqual(toNano(19))
    // expect((await owner1_wallet.getGetWalletData()).balance).toEqual(toNano(19))
  })

  it('should burn', async () => {
    const mintyResult = await jettonMaster.send(
      alice.getSender(),
      {
        value: toNano('1'),
      },
      {
        $$type: 'JettonTransfer',
        query_id: 5n,
        amount: toNano(1),
        destination: owner.address,
        response_destination: owner.address,
        custom_payload: beginCell().endCell(),
        forward_ton_amount: toNano(1),
        forward_payload: beginCell().storeInt(0, 32).storeStringTail('hello world').endCell().asSlice(),
      },
    )

    const jettonBurn: JettonBurn = {
      $$type: 'JettonBurn',
      query_id: 0n,
      amount: 1n,
      response_destination: alice.address,
      custom_payload: null,
    };

    // Alice's jetton wallet address
    const aliceWalletAddress = await jettonMaster.getGetWalletAddress(alice.address)
    // Alice's jetton wallet
    const aliceJettonContract = blockchain.openContract(await JettonWallet.fromAddress(aliceWalletAddress))
    // Alice's jetton wallet balance before burning
    const aliceBalanceBefore = (await aliceJettonContract.getGetWalletData()).balance

    // Alice burn 1 token
    const burnResult = await aliceJettonContract.send(
      alice.getSender(),
      {
        value: toNano('1'),
      },
      jettonBurn
    )

    // Check that Alice send JettonBurn msg to her jetton wallet
    expect(burnResult.transactions).toHaveTransaction({
      from: alice.address,
      to: aliceWalletAddress,
      success: true,
    })

    // Check that Alice's jetton wallet send JettonBurnNotification msg to JettonMaster
    expect(burnResult.transactions).toHaveTransaction({
      from: aliceWalletAddress,
      to: jettonMaster.address,
      success: true,
    })

    // Check that JettonMaster send JettonExcesses msg to Alice
    expect(burnResult.transactions).toHaveTransaction({
      from: jettonMaster.address,
      to: alice.address,
      success: true,
    })

    // Check that Alice's jetton wallet balance is subtracted 1
    const aliceBalanceAfter = (await aliceJettonContract.getGetWalletData()).balance;
    expect(aliceBalanceAfter).toEqual(aliceBalanceBefore - 1n);
  })
})
