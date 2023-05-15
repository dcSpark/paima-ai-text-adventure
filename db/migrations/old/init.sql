-- world is Y by X matrix
--        0     1     2    X
--     |-----|-----|-----|
--  0  | 0,0 | 1,0 | 2,0 |
--  1  | 0,1 | 1,1 | 2,1 |
--  2  | 0,2 | 1,2 | 2,2 |
-- 
--  Y
-- 
CREATE TABLE global_world_state (
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  can_visit BOOLEAN NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (x, y)
);

CREATE TABLE global_user_state (
  wallet TEXT NOT NULL PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  FOREIGN KEY (x, y) REFERENCES global_world_state (x, y)
);


-- -- Migration for global_world_state
-- ALTER TABLE global_world_state
--   DROP COLUMN x,
--   DROP COLUMN y,
--   DROP COLUMN can_visit,
--   ADD COLUMN userFreeTextMove TEXT NOT NULL,
--   ADD COLUMN oracleResponse TEXT;

-- -- Migration for global_user_state
-- ALTER TABLE global_user_state
--   DROP COLUMN x,
--   DROP COLUMN y,
--   ADD COLUMN userFreeTextMove TEXT NOT NULL;


--  possibly add 'match moves' to store all messages
--  created during a game.
--  may also need a lobby ID
--   CREATE TABLE match_moves (
--    id SERIAL PRIMARY KEY,
--    lobby_id TEXT NOT NULL references lobbies(lobby_id),
--    wallet TEXT NOT NULL,
--    round INTEGER NOT NULL,
--    move_pgn TEXT NOT NULL
-- );