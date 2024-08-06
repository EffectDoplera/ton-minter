import "@stdlib/deploy";
import "@stdlib/ownable";

import "./jetton_wallet";

struct JettonData {
  total_supply: Int;
  mintable: Bool;
  owner: Address;
  jetton_content: Cell;
  jetton_wallet_code: Cell;
}

@interface("org.ton.jetton.master")
trait Jetton with OwnableTransferable {
  total_supply: Int;
  mintable: Bool;
  owner: Address;
  content: Cell;

  receive(msg: JettonUpdateContent) {
    self.requireOwner();
    self.content = msg.jetton_content;
  }

  receive(msg: JettonBurnNotification) {
    self.requireWallet(msg.sender); // Check sender

    self.total_supply = self.total_supply - msg.amount; // Update balance
    self.requireTotalSupply();

    send(SendParameters {
      to: msg.response_destination, 
      value: 0,
      bounce: false,
      mode: SendRemainingValue + SendIgnoreErrors,
      body: JettonExcesses {
        query_id: msg.query_id
      }.toCell()  
    });
  }

  // @to The Address receive the Jetton token after minting
  // @amount The amount of Jetton token being minted
  // @response_destination The previous owner address
  fun mint(to: Address, amount: Int, response_destination: Address) {
    let init: StateInit = self.getJettonWalletInit(to);
    send(SendParameters{
      to: contractAddress(init), 
      value: 0, 
      bounce: false,
      mode: SendRemainingValue,
      body: TokenTransferInternal { 
        query_id: 0,
        amount: amount,
        from: myAddress(),
        response_destination: response_destination,
        forward_ton_amount: 0,
        forward_payload: emptySlice()
      }.toCell(),
      code: init.code,
      data: init.data
    });
  }

  fun requireWallet(owner: Address) {
    let init: StateInit = self.getJettonWalletInit(owner);
    require(contractAddress(init) == sender(), "Invalid sender");
  }

  fun requireTotalSupply() {
    require(self.total_supply >= 0, "Invalid amount");
  }

  virtual fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWallet(myAddress(), address);
  }

  get fun get_jetton_data(): JettonData {
    let code: Cell = self.getJettonWalletInit(myAddress()).code;

    return JettonData { 
      total_supply: self.total_supply, 
      mintable: self.mintable, 
      owner: self.owner, 
      jetton_content: self.content, 
      jetton_wallet_code: code
    };
  }

  get fun get_wallet_address(owner: Address): Address {
    let init: StateInit = self.getJettonWalletInit(owner);
    return contractAddress(init);
  }
}