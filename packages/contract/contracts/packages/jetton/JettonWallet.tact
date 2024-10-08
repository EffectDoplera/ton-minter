message(0x0f8a7ea5) JettonTransfer {
    query_id: Int as uint64; // arbitrary request number
    amount: Int as coins; // amount of jettons to transfer
    destination: Address; // address of the new owner of the jettons
    response_destination: Address; // address where to send a response with confirmation of a successful transfer and the rest of the incoming message Toncoins.
    custom_payload: Cell?; // optional custom payload
    forward_ton_amount: Int as coins; // the amount of nanotons to be sent to the destination address.
    forward_payload: Slice as remaining; // optional custom data that should be sent to the destination address.
}

message(0x7362d09c) JettonTransferNotification {
    query_id: Int as uint64; // arbitrary request number
    amount: Int as coins; // amount of jettons to transfer
    sender: Address; // address of the sender of the jettons
    forward_payload: Slice as remaining; // optional custom payload
}

message(0x595f07bc) JettonBurn {
    query_id: Int as uint64; // arbitrary request number
    amount: Int as coins; // amount of jettons to burn
    response_destination: Address; // address where to send a response with confirmation of a successful burn and the rest of the incoming message coins.
    custom_payload: Cell?; // optional custom payload
}

message(0xd53276db) JettonExcesses {
    query_id: Int as uint64; // arbitrary request number
}

message(0x178d4519) JettonInternalTransfer {
    query_id: Int as uint64; // arbitrary request number
    amount: Int as coins; // amount of jettons to transfer
    from: Address; // address of the sender of the jettons
    response_address: Address?; // address where to send a response with confirmation of a successful transfer and the rest of the incoming message coins.
    forward_ton_amount: Int as coins; // the amount of nanotons to be sent to the destination address.
    forward_payload: Slice as remaining; // optional custom data that should be sent to the destination address.
}

message(0x7bdd97de) JettonBurnNotification {
    query_id: Int as uint64; // arbitrary request number
    amount: Int as coins; // amount of jettons to burn
    sender: Address; // address of the sender of the jettons
    response_destination: Address; // address where to send a response with confirmation of a successful burn and the rest of the incoming message coins.
}

struct WalletData {
    balance: Int as coins; // amount of jettons on wallet
    owner: Address; // address of wallet owner;
    jetton: Address; // address of Jetton master-address
    jetton_wallet_code: Cell; // with code of this wallet
}

// ============================================================ //
trait JettonWallet {
    balance: Int;
    owner: Address;
    jetton_master: Address;
    virtual const gasConsumption: Int = ton("0.01");
    virtual const minTonsForStorage: Int = ton("0.01");

    receive(msg: JettonTransfer){
        let ctx: Context = context();
        self.balance = (self.balance - msg.amount);
        require(self.balance >= 0, "JettonWallet: Not enough jettons to transfer");
        self._transfer_validate(ctx, msg);
        self._transfer_estimate_remain_value(ctx, msg);
        self._transfer_jetton(ctx, msg);
    }

    receive(msg: JettonBurn){
        let ctx: Context = context();
        self.balance = (self.balance - msg.amount);
        require(self.balance >= 0, "JettonWallet: Not enough balance to burn tokens");
        self._burn_validate(ctx, msg);
        self._burn_tokens(ctx, msg);
    }

    receive(msg: JettonInternalTransfer){
        let ctx: Context = context();
        self.balance = (self.balance + msg.amount);
        require(self.balance >= 0, "JettonWallet: Not allow negative balance after internal transfer");
        self._internal_transfer_validate(ctx, msg);
        let remain: Int = self._internal_transfer_estimate_remain_value(ctx, msg);
        if (msg.forward_ton_amount > 0) {
            self._internal_transfer_notification(ctx, msg);
        }
        self._internal_transfer_excesses(ctx, msg, remain);
    }

    bounced(src: bounced<JettonInternalTransfer>){
        self.balance = (self.balance + src.amount);
    }

    bounced(src: bounced<JettonBurnNotification>){
        self.balance = (self.balance + src.amount);
    }

    abstract inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit;

    virtual inline fun _transfer_validate(ctx: Context, msg: JettonTransfer) {
        require(ctx.sender == self.owner, "JettonWallet: Only owner can call this function");
    }

    virtual inline fun _burn_validate(ctx: Context, msg: JettonBurn) {
        require(ctx.sender == self.owner, "JettonWallet: Only owner can burn tokens");
    }

    virtual inline fun _transfer_estimate_remain_value(ctx: Context, msg: JettonTransfer) {
        let fwd_count: Int = 1;
        if (msg.forward_ton_amount > 0) {
            fwd_count = 2;
        }
        require(ctx.value > ((fwd_count * ctx.readForwardFee() + 2 * self.gasConsumption) + self.minTonsForStorage),
            "Not enough funds to transfer"
        );
    }

    virtual inline fun _transfer_jetton(ctx: Context, msg: JettonTransfer) {
        let init: StateInit = self.calculate_jetton_wallet_init(msg.destination);
        let receiver: Address = contractAddress(init);
        send(SendParameters{
                to: receiver,
                value: 0,
                bounce: true,
                mode: SendRemainingValue,
                body: JettonInternalTransfer{
                    query_id: msg.query_id,
                    amount: msg.amount,
                    response_address: msg.response_destination,
                    from: self.owner,
                    forward_ton_amount: msg.forward_ton_amount,
                    forward_payload: msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            }
        );
    }

    virtual inline fun _burn_tokens(ctx: Context, msg: JettonBurn) {
        send(SendParameters{
                to: self.jetton_master,
                value: 0,
                mode: SendRemainingValue,
                bounce: true,
                body: JettonBurnNotification{
                    query_id: msg.query_id,
                    amount: msg.amount,
                    sender: self.owner,
                    response_destination: msg.response_destination
                }.toCell()
            }
        );
    }

    virtual inline fun _internal_transfer_validate(ctx: Context, msg: JettonInternalTransfer) {
        if (ctx.sender != self.jetton_master) {
            let init: StateInit = self.calculate_jetton_wallet_init(msg.from);
            require(ctx.sender == contractAddress(init),
                "JettonWallet: Only Jetton master or Jetton wallet can call this function"
            );
        }
    }

    virtual inline fun _internal_transfer_estimate_remain_value(ctx: Context, msg: JettonInternalTransfer): Int {
        let tonBalanceBeforeMsg: Int = (myBalance() - ctx.value);
        let storage_fee: Int = (self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage));
        let remain: Int = (ctx.value - (storage_fee + self.gasConsumption));
        if (msg.forward_ton_amount > 0) {
            remain = (remain - (ctx.readForwardFee() + msg.forward_ton_amount));
        }
        return remain;
    }

    virtual inline fun _internal_transfer_notification(ctx: Context, msg: JettonInternalTransfer) {
        if (msg.forward_ton_amount > 0) {
            send(SendParameters{
                    to: self.owner,
                    value: msg.forward_ton_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: JettonTransferNotification{
                        query_id: msg.query_id,
                        amount: msg.amount,
                        sender: msg.from,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }
            );
        }
    }

    virtual inline fun _internal_transfer_excesses(ctx: Context, msg: JettonInternalTransfer, remain: Int) {
        if (msg.response_address != null && remain > 0) {
            send(SendParameters{
                    to: msg.response_address!!,
                    value: remain,
                    bounce: false,
                    mode: SendIgnoreErrors,
                    body: JettonExcesses{query_id: msg.query_id}.toCell()
                }
            );
        }
    }

    get fun get_wallet_data(): WalletData {
        return
            WalletData{
                balance: self.balance,
                owner: self.owner,
                jetton: self.jetton_master,
                jetton_wallet_code: self.calculate_jetton_wallet_init(self.owner).code
            };
    }
}