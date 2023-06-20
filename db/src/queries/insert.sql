

/* 
  @name create_nft_state
*/
INSERT INTO nft_state (
  nft_id,
  nft_description,
  contract_address
) VALUES (
  :nft_id!,
  :nft_description!,
  :contract_address!
);

/* 
  @name add_match_move
*/
INSERT INTO match_moves (
  wallet,
  lobby_id,
  move_entry,
  nft_id,
  contract_address,
  is_oracle
) VALUES (
  :wallet!,
  :lobby_id!,
  :move_entry!,
  :nft_id!,
  :contract_address!,
  FALSE
);

/* 
  @name add_oracle_move
*/
INSERT INTO match_moves (
  lobby_id,
  move_entry,
  is_oracle
) VALUES (
  :lobby_id!,
  :move_entry!,
  TRUE
);

/*
  @name create_lobby
*/
INSERT INTO lobbies (
  open,
  lobby_description,
  lobby_id,
  created_by
) VALUES (
  TRUE,
  :lobby_description!,
  :lobby_id!,
  :created_by!
);
