/* @name getLatestBlockData */
SELECT * FROM block_heights 
ORDER BY block_height DESC
LIMIT 1
;

/* @name getLatestProcessedBlockHeight */
SELECT * FROM block_heights 
WHERE done IS TRUE
ORDER BY block_height DESC
LIMIT 1
;

/* @name getBlockData */
SELECT * FROM block_heights 
WHERE block_height = :block_height
;

/* @name getNftState */
SELECT * FROM nft_state
WHERE nft_id = :nft_id
;

/* @name getLobbyMoves */
SELECT * FROM match_moves
WHERE lobby_id = :lobby_id
ORDER BY id DESC;


/* @name getNftsForLobby */
SELECT * FROM nft_state
WHERE lobby_id = :lobby_id;


/* @name getNFTStateForOwner */
SELECT *
FROM nft_state
WHERE nft_id IN (
    SELECT token_id
    FROM cde_erc721_data
    WHERE nft_owner = :owner!
);

/* @name getAllOwnedNFTStates */
SELECT *
FROM nft_state
WHERE nft_id = ANY(:nft_id_array) AND contract_address = :contract_address;
