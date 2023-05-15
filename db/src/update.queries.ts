/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'JoinNftToLobby' parameters type */
export interface IJoinNftToLobbyParams {
  contract_address: string;
  lobby_id: string;
  nft_id: string;
}

/** 'JoinNftToLobby' return type */
export type IJoinNftToLobbyResult = void;

/** 'JoinNftToLobby' query type */
export interface IJoinNftToLobbyQuery {
  params: IJoinNftToLobbyParams;
  result: IJoinNftToLobbyResult;
}

const joinNftToLobbyIR: any = {"usedParamSet":{"lobby_id":true,"nft_id":true,"contract_address":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":32,"b":41}]},{"name":"nft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":65}]},{"name":"contract_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":107}]}],"statement":"UPDATE nft_state\nset lobby_id = :lobby_id!\nWHERE nft_id = :nft_id! and contract_address = :contract_address!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE nft_state
 * set lobby_id = :lobby_id!
 * WHERE nft_id = :nft_id! and contract_address = :contract_address!
 * ```
 */
export const joinNftToLobby = new PreparedQuery<IJoinNftToLobbyParams,IJoinNftToLobbyResult>(joinNftToLobbyIR);


/** 'UpdateNftState' parameters type */
export interface IUpdateNftStateParams {
  contract_address: string;
  nft_description: string;
  nft_id: string;
}

/** 'UpdateNftState' return type */
export type IUpdateNftStateResult = void;

/** 'UpdateNftState' query type */
export interface IUpdateNftStateQuery {
  params: IUpdateNftStateParams;
  result: IUpdateNftStateResult;
}

const updateNftStateIR: any = {"usedParamSet":{"nft_description":true,"nft_id":true,"contract_address":true},"params":[{"name":"nft_description","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":55}]},{"name":"nft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":79}]},{"name":"contract_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":104,"b":121}]}],"statement":"UPDATE nft_state\nSET nft_description = :nft_description!\nWHERE nft_id = :nft_id! and contract_address = :contract_address!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE nft_state
 * SET nft_description = :nft_description!
 * WHERE nft_id = :nft_id! and contract_address = :contract_address!
 * ```
 */
export const updateNftState = new PreparedQuery<IUpdateNftStateParams,IUpdateNftStateResult>(updateNftStateIR);


