import "@stdlib/deploy";
import "./messages";

struct JettonWalletData {
  balance: Int;
  owner: Address;
  master: Address;
  walletCode: Cell;
}

@interface("org.ton.jetton.wallet")
contract JettonWallet with Deployable {
  const minTonsForStorage: Int = ton("0.01");
  const gasConsumption: Int = ton("0.01");

  balance: Int as coins = 0;
  owner: Address;
  master: Address;

  init(master: Address, owner: Address, ) {
    self.owner = owner;
    self.master = master;
  }

  receive(msg: Transfer) {
    let ctx: Context = context();
    require(self.owner == ctx.sender, "Invalid sender");

    // Gas checks
    let fwdFee: Int = ctx.readForwardFee() * 2;
    let final: Int = 2 * self.gasConsumption + self.minTonsForStorage + fwdFee;
    require(ctx.value > min(final, ton("0.01")), "Invalid value");
    
    // Update balance
    self.balance = self.balance - msg.amount;
    require(self.balance >= 0, "Invalid Jetton amount");

    // Send transaction
    let init: StateInit = initOf JettonWallet(self.master, msg.destination);  
    let walletAddress: Address = contractAddress(init);
    send(SendParameters {
            to: walletAddress, 
            value: 0,
            mode: SendRemainingValue, 
            bounce: false,
            body: JettonTransferInternal {
              query_id: msg.query_id,
              amount: msg.amount,
              from: self.owner,
              response_destination: msg.response_destination,
              forward_ton_amount: msg.forward_ton_amount,
              forward_payload: msg.forward_payload
            }.toCell(),
            code: init.code,
            data: init.data
        });
  }

  receive(msg: JettonTransferInternal) {
    let ctx: Context = context();
    if (ctx.sender != self.master) {
      let init: StateInit = initOf JettonWallet(self.master, msg.from);
      require(contractAddress(init) == ctx.sender, "Invalid sender");
    }

    // Update balance
    self.balance = self.balance + msg.amount;
    require(self.balance >= 0, "Invalid balance"); 

    // Get value for gas
    let msgValue: Int = self.msgValue(ctx.value);
    let fwdFee: Int = ctx.readForwardFee();
    msgValue = msgValue - msg.forward_ton_amount - fwdFee;

    // Notify the new owner of JettonJetton that the transfer is complete
    if (msg.forward_ton_amount > 0) { 
      send(SendParameters {
        to: self.owner,
        value: msg.forward_ton_amount,
        mode: SendPayGasSeparately + SendIgnoreErrors,
        bounce: false,
        body: JettonNotification {
          query_id: msg.query_id,
          amount: msg.amount,
          from: msg.from,
          forward_payload: msg.forward_payload
        }.toCell()
      });
    }

    // Cashback to the original Sender
    if (msgValue > 0) { 
      send(SendParameters {
        to: msg.response_destination, 
        value: msgValue,  
        bounce: false,
        body: JettonExcesses { 
          query_id: msg.query_id
        }.toCell(),
        mode: SendIgnoreErrors
      });
    }
  }

  receive(msg: JettonBurn) {
    let ctx: Context = context();
    require(ctx.sender == self.owner, "Invalid sender");  // Check sender

    self.balance = self.balance - msg.amount; // Update balance
    require(self.balance >= 0, "Invalid balance");

    let fwdFee: Int = ctx.readForwardFee(); // Gas checks
    require(ctx.value > fwdFee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

    // Burn Jettons
    send(SendParameters {  
      to: self.master,
      value: 0,
      mode: SendRemainingValue,
      bounce: true,
      body: JettonBurnNotification {
        query_id: msg.query_id,
        amount: msg.amount,
        owner: self.owner,
        response_destination: self.owner
      }.toCell()
    });
  }

  fun msgValue(value: Int): Int {
    let msgValue: Int = value;
    let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
    let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
    msgValue = msgValue - (storageFee + self.gasConsumption);
    return msgValue;
  }

  bounced(src: bounced<JettonTransferInternal>) {
    self.balance = self.balance + src.amount;
  }

  bounced(src: bounced<JettonBurnNotification>) {
    self.balance = self.balance + src.amount;
  }

  get fun get_wallet_data(): JettonWalletData {
    return JettonWalletData {
      balance: self.balance,
      owner: self.owner,
      master: self.master,
      walletCode: (initOf JettonWallet(self.master, self.owner)).code
    };
  }
}