message(0xf8a7ea5) Transfer {
  query_id: Int as uint64;
  amount: Int as coins;
  destination: Address;
  response_destination: Address;
  custom_payload: Cell?;
  forward_ton_amount: Int as coins;
  forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x178d4519) JettonTransferInternal {
  query_id: Int as uint64;
  amount: Int as coins;
  from: Address;
  response_destination: Address;
  forward_ton_amount: Int as coins;
  forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x7362d09c) JettonNotification {
  query_id: Int as uint64;
  amount: Int as coins;
  from: Address;
  forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
}

message(0x595f07bc) JettonBurn {
  query_id: Int as uint64;
  amount: Int as coins;
  owner: Address;
  response_destination: Address;
}

message(0x7bdd97de) JettonBurnNotification {
  query_id: Int as uint64;
  amount: Int as coins;
  owner: Address;
  response_destination: Address?;
}

message(0xd53276db) JettonExcesses {
  query_id: Int as uint64;
}

message JettonUpdateContent {
  content: Cell;
}