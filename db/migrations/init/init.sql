-- Generic paima engine table, that can't be modified
CREATE TABLE block_heights ( 
  block_height INTEGER PRIMARY KEY,
  seed TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

CREATE FUNCTION increment_move_number() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(MAX(move_number), 0) + 1 INTO NEW.move_number FROM match_moves WHERE lobby_id = NEW.lobby_id;
  RETURN NEW;
END;
$$;


--
-- Name: lobbies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE lobbies (
    open boolean NOT NULL,
    lobby_description text,
    lobby_id text PRIMARY KEY,
    created_by text NOT NULL
);

--
-- Name: nft_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE nft_state (
    nft_id text NOT NULL,
    nft_description text,
    lobby_id text,
    contract_address text NOT NULL,
    FOREIGN KEY (lobby_id) REFERENCES lobbies (lobby_id),
    PRIMARY KEY (contract_address, nft_id)
);

CREATE index nft_state_nft_id_index ON nft_state (nft_id);

--
-- Name: match_moves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE match_moves (
    id SERIAL PRIMARY KEY,
    wallet text,
    is_oracle boolean,
    lobby_id text,
    move_number integer,
    move_entry text,
    contract_address text,
    nft_id text,
    FOREIGN KEY (lobby_id) REFERENCES lobbies (lobby_id),
    FOREIGN KEY (contract_address, nft_id) REFERENCES nft_state (contract_address, nft_id)

);

--
-- Name: match_moves increment_move_number_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER increment_move_number_trigger BEFORE INSERT ON match_moves FOR EACH ROW EXECUTE FUNCTION increment_move_number();

-- Creates the initial lobby
-- BEGIN;
  -- INSERT INTO lobbies (open, lobby_description, lobby_id) VALUES (TRUE, 'The First Kingdom', '1');
-- COMMIT;
