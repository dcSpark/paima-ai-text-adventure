DROP table global_world_state;

create table global_world_state(
    userFreeTextMove TEXT NOT NULL,
    oracleResponse TEXT NOT NULL,
    lobby_id TEXT NOT NULL PRIMARY KEY,
    current_round_number INT NOT NULL
)