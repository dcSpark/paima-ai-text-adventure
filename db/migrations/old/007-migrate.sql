CREATE TABLE lobbies (
    lobby_id SERIAL PRIMARY KEY,
    -- Add other columns here for the lobbies table as needed. For example:
    open boolean NOT NULL,
    lobby_description TEXT
);

CREATE table players (
    wallet TEXT PRIMARY KEY
    -- Add other columns here for the players table as needed. For example:
    -- player_name TEXT NOT NULL,
    -- player_description TEXT
);

CREATE TABLE nft_state (
    nft_id TEXT PRIMARY KEY,
    nft_description TEXT,
    current_owner TEXT,
    lobby_id INTEGER NULL,
    FOREIGN KEY (lobby_id) REFERENCES lobbies (lobby_id),
    FOREIGN KEY (current_owner) REFERENCES players (wallet),
    UNIQUE (current_owner, nft_id)
);

-- wallet, nft id can be null if is_oracle is true
CREATE TABLE match_moves (
    id SERIAL PRIMARY KEY,
    wallet TEXT NULL, 
    is_oracle BOOLEAN,
    lobby_id INTEGER,
    move_number INTEGER,
    move_entry TEXT,
    nft_id TEXT NULL,
    FOREIGN KEY (wallet) REFERENCES players (wallet),
    FOREIGN KEY (lobby_id) REFERENCES lobbies (lobby_id),
    FOREIGN KEY (nft_id) REFERENCES nft_state (nft_id)
);


-- TODO: Review before migrating
-- This ensures that the move_number is incremented for each move
-- in a lobby. This is necessary because the primary key is a composite
-- of lobby_id and move_number and we want to ensure that the move_number
-- is unique for each player move on a given lobby.
CREATE OR REPLACE FUNCTION increment_move_number() RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(move_number), 0) + 1 INTO NEW.move_number FROM match_moves WHERE lobby_id = NEW.lobby_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_move_number_trigger
BEFORE INSERT ON match_moves 
FOR EACH ROW EXECUTE FUNCTION increment_move_number();

-- Also TODO: Where to store oracle responses in sequential order?
-- could possibly store it on the match_moves table, but that would
-- require a new column for indicating a oracle response.
-- It can also go in world state, but that would still need some 
-- cross referencing on either move number or block height for figuring out
-- the sequence of oracle responses intermingled with player moves.


-- ALTER TABLE global_user_state 
-- ADD COLUMN joined_lobby_id TEXT,
-- DROP COLUMN userFreeTextMove,
-- ADD FOREIGN KEY (joined_lobby_id) REFERENCES lobbies (lobby_id);
drop table global_world_state;
-- note: we likely can drop the lobby_id later on as long as
-- it remains tied to the NFT ID
