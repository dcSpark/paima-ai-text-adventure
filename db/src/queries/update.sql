/* @name joinNftToLobby */
UPDATE nft_state
set lobby_id = :lobby_id!
WHERE nft_id = :nft_id! and contract_address = :contract_address!;

/* @name updateNftState */
UPDATE nft_state
SET nft_description = :nft_description!
WHERE nft_id = :nft_id! and contract_address = :contract_address!;
