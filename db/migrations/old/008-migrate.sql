BEGIN;

-- 1. Drop the foreign key constraint on nft_state
ALTER TABLE nft_state DROP CONSTRAINT nft_state_lobby_id_fkey;

-- 2. Drop the foreign key constraint on match_moves
ALTER TABLE match_moves DROP CONSTRAINT match_moves_lobby_id_fkey;

-- 3. Change the type of the lobby_id column in the lobbies table
ALTER TABLE lobbies
ALTER COLUMN lobby_id TYPE TEXT USING lobby_id::text;

-- 4. Change the type of the lobby_id column in the nft_state table
ALTER TABLE nft_state
ALTER COLUMN lobby_id TYPE TEXT USING lobby_id::text;

-- 5. Change the type of the lobby_id column in the match_moves table
ALTER TABLE match_moves
ALTER COLUMN lobby_id TYPE TEXT USING lobby_id::text;

-- 6. Add back the foreign key constraint on nft_state
ALTER TABLE nft_state
ADD CONSTRAINT nft_state_lobby_id_fkey FOREIGN KEY (lobby_id) REFERENCES lobbies(lobby_id);

-- 7. Add back the foreign key constraint on match_moves
ALTER TABLE match_moves
ADD CONSTRAINT match_moves_lobby_id_fkey FOREIGN KEY (lobby_id) REFERENCES lobbies(lobby_id);

COMMIT;
