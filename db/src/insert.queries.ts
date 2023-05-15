/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateNftState' parameters type */
export interface ICreateNftStateParams {
  contract_address: string;
  nft_description: string;
  nft_id: string;
}

/** 'CreateNftState' return type */
export type ICreateNftStateResult = void;

/** 'CreateNftState' query type */
export interface ICreateNftStateQuery {
  params: ICreateNftStateParams;
  result: ICreateNftStateResult;
}

const createNftStateIR: any = {"usedParamSet":{"nft_id":true,"nft_description":true,"contract_address":true},"params":[{"name":"nft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":92}]},{"name":"nft_description","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":113}]},{"name":"contract_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":118,"b":135}]}],"statement":"INSERT INTO nft_state (\n  nft_id,\n  nft_description,\n  contract_address\n) VALUES (\n  :nft_id!,\n  :nft_description!,\n  :contract_address!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO nft_state (
 *   nft_id,
 *   nft_description,
 *   contract_address
 * ) VALUES (
 *   :nft_id!,
 *   :nft_description!,
 *   :contract_address!
 * )
 * ```
 */
export const createNftState = new PreparedQuery<ICreateNftStateParams,ICreateNftStateResult>(createNftStateIR);


/** 'AddMatchMove' parameters type */
export interface IAddMatchMoveParams {
  contract_address: string;
  lobby_id: string;
  move_entry: string;
  nft_id: string;
  wallet: string;
}

/** 'AddMatchMove' return type */
export type IAddMatchMoveResult = void;

/** 'AddMatchMove' query type */
export interface IAddMatchMoveQuery {
  params: IAddMatchMoveParams;
  result: IAddMatchMoveResult;
}

const addMatchMoveIR: any = {"usedParamSet":{"wallet":true,"lobby_id":true,"move_entry":true,"nft_id":true,"contract_address":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":124}]},{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":138}]},{"name":"move_entry","required":true,"transform":{"type":"scalar"},"locs":[{"a":143,"b":154}]},{"name":"nft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":159,"b":166}]},{"name":"contract_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":171,"b":188}]}],"statement":"INSERT INTO match_moves (\n  wallet,\n  lobby_id,\n  move_entry,\n  nft_id,\n  contract_address,\n  is_oracle\n) VALUES (\n  :wallet!,\n  :lobby_id!,\n  :move_entry!,\n  :nft_id!,\n  :contract_address!,\n  FALSE\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO match_moves (
 *   wallet,
 *   lobby_id,
 *   move_entry,
 *   nft_id,
 *   contract_address,
 *   is_oracle
 * ) VALUES (
 *   :wallet!,
 *   :lobby_id!,
 *   :move_entry!,
 *   :nft_id!,
 *   :contract_address!,
 *   FALSE
 * )
 * ```
 */
export const addMatchMove = new PreparedQuery<IAddMatchMoveParams,IAddMatchMoveResult>(addMatchMoveIR);


/** 'AddOracleMove' parameters type */
export interface IAddOracleMoveParams {
  lobby_id: string;
  move_entry: string;
}

/** 'AddOracleMove' return type */
export type IAddOracleMoveResult = void;

/** 'AddOracleMove' query type */
export interface IAddOracleMoveQuery {
  params: IAddOracleMoveParams;
  result: IAddOracleMoveResult;
}

const addOracleMoveIR: any = {"usedParamSet":{"lobby_id":true,"move_entry":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":86}]},{"name":"move_entry","required":true,"transform":{"type":"scalar"},"locs":[{"a":91,"b":102}]}],"statement":"INSERT INTO match_moves (\n  lobby_id,\n  move_entry,\n  is_oracle\n) VALUES (\n  :lobby_id!,\n  :move_entry!,\n  TRUE\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO match_moves (
 *   lobby_id,
 *   move_entry,
 *   is_oracle
 * ) VALUES (
 *   :lobby_id!,
 *   :move_entry!,
 *   TRUE
 * )
 * ```
 */
export const addOracleMove = new PreparedQuery<IAddOracleMoveParams,IAddOracleMoveResult>(addOracleMoveIR);


