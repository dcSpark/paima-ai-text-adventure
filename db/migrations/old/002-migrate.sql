-- Migration for global_user_state
ALTER TABLE global_user_state
  DROP COLUMN x,
  DROP COLUMN y,
  ADD COLUMN userFreeTextMove TEXT;

UPDATE global_user_state
SET userFreeTextMove = ''
WHERE userFreeTextMove IS NULL;

ALTER TABLE global_user_state
ALTER COLUMN userFreeTextMove SET NOT NULL;


-- Migration for global_world_state
ALTER TABLE global_world_state
  DROP COLUMN x,
  DROP COLUMN y,
  DROP COLUMN can_visit,
  ADD COLUMN userFreeTextMove TEXT,
  ADD COLUMN oracleResponse TEXT;

