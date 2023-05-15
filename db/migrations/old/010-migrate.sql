-- Drop the foreign key constraints
ALTER TABLE nft_state DROP CONSTRAINT nft_state_lobby_id_fkey;
ALTER TABLE match_moves DROP CONSTRAINT match_moves_lobby_id_fkey;

-- Add a new text column
-- ALTER TABLE lobbies ADD COLUMN new_lobby_id TEXT;

-- Copy the data from lobby_id to new_lobby_id
UPDATE lobbies SET new_lobby_id = CAST(lobby_id AS TEXT);

-- Drop the old integer column
ALTER TABLE lobbies DROP COLUMN lobby_id;

-- Rename the new column
ALTER TABLE lobbies RENAME COLUMN new_lobby_id TO lobby_id;

-- Add the primary key constraint to the new column
ALTER TABLE lobbies ADD PRIMARY KEY (lobby_id);

-- Update the type of the referencing columns in the other tables
ALTER TABLE nft_state ALTER COLUMN lobby_id TYPE TEXT USING CAST(lobby_id AS TEXT);
ALTER TABLE match_moves ALTER COLUMN lobby_id TYPE TEXT USING CAST(lobby_id AS TEXT);

-- Re-add the foreign key constraints
ALTER TABLE nft_state ADD CONSTRAINT nft_state_lobby_id_fkey FOREIGN KEY (lobby_id) REFERENCES lobbies (lobby_id);
ALTER TABLE match_moves ADD CONSTRAINT match_moves_lobby_id_fkey FOREIGN KEY (lobby_id) REFERENCES lobbies (lobby_id);
