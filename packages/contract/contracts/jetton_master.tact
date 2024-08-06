import "@stdlib/deploy";
import "@stdlib/ownable";

import "./jetton_wallet";

struct JettonMasterData {
  total_supply: Int;
  mintable: Bool;
  owner: Address;
  jetton_content: Cell;
  jetton_wallet_code: Cell;
}

@interface("org.ton.jetton.master")
contract JettonMaster with OwnableTransferable, Deployable {
  const minTonsForStorage: Int = ton("0.01");
  const gasConsumption: Int = ton("0.01");

  total_supply: Int as coins = 0; 
  mintable: Bool = true;
  owner: Address;
  jetton_content: Cell;

  init(owner: Address, jetton_content: Cell) {
    self.owner = owner;
    self.jetton_content = jetton_content;
  }

  receive(msg: JettonUpdateContent) {
    self.requireOwner();
    self.jetton_content = msg.jetton_content;
  }

  receive(msg: JettonTransfer) {
    self.requireOwner();

    require(self.mintable, "Mint stopped");

    let ctx: Context = context();
    // Gas checks
    let fwdFee: Int = ctx.readForwardFee() * 2;
    let final: Int = 2 * self.gasConsumption + self.minTonsForStorage + fwdFee;
    require(ctx.value > min(final, ton("0.01")), "Invalid value");

    self.total_supply = self.total_supply + msg.amount;

    // Send transaction
    let init: StateInit = self.getJettonWalletInit(msg.destination);
    let walletAddress: Address = contractAddress(init);
    send(SendParameters {
      to: walletAddress, 
      value: 0,
      mode: SendRemainingValue, 
      bounce: false,
      body: JettonInternalTransfer {
        query_id: msg.query_id,
        amount: msg.amount,
        from: self.owner,
        response_address: msg.response_destination,
        forward_ton_amount: msg.forward_ton_amount,
        forward_payload: msg.forward_payload
      }.toCell(),
      code: init.code,
      data: init.data
    });
  }

  receive(msg: JettonBurnNotification) {
    self.requireWallet(msg.sender);
    self.total_supply = self.total_supply - msg.amount;

    send(SendParameters {
      to: msg.response_destination, 
      value: 0,
      bounce: false,
      mode: SendRemainingValue + SendIgnoreErrors,
      body: JettonExcesses{
        query_id: msg.query_id
      }.toCell()
    });
  }

  // @to The Address receive the Jetton Jetton after minting
  // @amount The amount of Jetton Jetton being minted
  // @response_destination The previous owner address
  // fun mint(to: Address, amount: Int, response_destination: Address) {
  //     require(self.total_supply + amount <= self.max_supply, "The total supply will be overlapping.");
  //     self.total_supply = self.total_supply + amount; // Update total supply

  //     let init: StateInit = self.getJettonWalletInit(to); // Create message
  //     send(SendParameters{
  //         to: contractAddress(init), 
  //         value: 0, 
  //         bounce: false,
  //         mode: SendRemainingValue,
  //         body: JettonTransferInternal{ 
  //             query_id: 0,
  //             amount: amount,
  //             from: myAddress(),
  //             response_destination: response_destination,
  //             forward_ton_amount: 0,
  //             forward_payload: emptySlice()
  //         }.toCell(),
  //         code: init.code,
  //         data: init.data
  //     });
  // }

  fun requireWallet(owner: Address) {
    let ctx: Context = context();
    let init: StateInit = self.getJettonWalletInit(owner);
    require(contractAddress(init) == ctx.sender, "Invalid sender");
  }

  fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWallet(myAddress(), address);
  }

  get fun get_jetton_data(): JettonMasterData {
    let code: Cell = self.getJettonWalletInit(myAddress()).code;
    return JettonMasterData { 
      total_supply: self.total_supply, 
      mintable: self.mintable, 
      owner: self.owner, 
      jetton_content: self.jetton_content, 
      jetton_wallet_code: code
    };
  }

  get fun get_wallet_address(owner: Address): Address {
    let init: StateInit = self.getJettonWalletInit(owner);
    return contractAddress(init);
  }
}