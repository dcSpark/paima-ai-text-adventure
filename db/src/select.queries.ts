/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'GetLatestBlockData' parameters type */
export type IGetLatestBlockDataParams = void;

/** 'GetLatestBlockData' return type */
export interface IGetLatestBlockDataResult {
  block_height: number;
  done: boolean;
  seed: string;
}

/** 'GetLatestBlockData' query type */
export interface IGetLatestBlockDataQuery {
  params: IGetLatestBlockDataParams;
  result: IGetLatestBlockDataResult;
}

const getLatestBlockDataIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM block_heights \nORDER BY block_height DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM block_heights 
 * ORDER BY block_height DESC
 * LIMIT 1
 * ```
 */
export const getLatestBlockData = new PreparedQuery<IGetLatestBlockDataParams,IGetLatestBlockDataResult>(getLatestBlockDataIR);


/** 'GetLatestProcessedBlockHeight' parameters type */
export type IGetLatestProcessedBlockHeightParams = void;

/** 'GetLatestProcessedBlockHeight' return type */
export interface IGetLatestProcessedBlockHeightResult {
  block_height: number;
  done: boolean;
  seed: string;
}

/** 'GetLatestProcessedBlockHeight' query type */
export interface IGetLatestProcessedBlockHeightQuery {
  params: IGetLatestProcessedBlockHeightParams;
  result: IGetLatestProcessedBlockHeightResult;
}

const getLatestProcessedBlockHeightIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM block_heights \nWHERE done IS TRUE\nORDER BY block_height DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM block_heights 
 * WHERE done IS TRUE
 * ORDER BY block_height DESC
 * LIMIT 1
 * ```
 */
export const getLatestProcessedBlockHeight = new PreparedQuery<IGetLatestProcessedBlockHeightParams,IGetLatestProcessedBlockHeightResult>(getLatestProcessedBlockHeightIR);


/** 'GetBlockData' parameters type */
export interface IGetBlockDataParams {
  block_height: number | null | void;
}

/** 'GetBlockData' return type */
export interface IGetBlockDataResult {
  block_height: number;
  done: boolean;
  seed: string;
}

/** 'GetBlockData' query type */
export interface IGetBlockDataQuery {
  params: IGetBlockDataParams;
  result: IGetBlockDataResult;
}

const getBlockDataIR: any = {"usedParamSet":{"block_height":true},"params":[{"name":"block_height","required":false,"transform":{"type":"scalar"},"locs":[{"a":50,"b":62}]}],"statement":"SELECT * FROM block_heights \nWHERE block_height = :block_height"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM block_heights 
 * WHERE block_height = :block_height
 * ```
 */
export const getBlockData = new PreparedQuery<IGetBlockDataParams,IGetBlockDataResult>(getBlockDataIR);


/** 'GetNftState' parameters type */
export interface IGetNftStateParams {
  nft_id: string | null | void;
}

/** 'GetNftState' return type */
export interface IGetNftStateResult {
  contract_address: string;
  lobby_id: string | null;
  nft_description: string | null;
  nft_id: string;
}

/** 'GetNftState' query type */
export interface IGetNftStateQuery {
  params: IGetNftStateParams;
  result: IGetNftStateResult;
}

const getNftStateIR: any = {"usedParamSet":{"nft_id":true},"params":[{"name":"nft_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":45}]}],"statement":"SELECT * FROM nft_state\nWHERE nft_id = :nft_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM nft_state
 * WHERE nft_id = :nft_id
 * ```
 */
export const getNftState = new PreparedQuery<IGetNftStateParams,IGetNftStateResult>(getNftStateIR);


/** 'GetLobbyMoves' parameters type */
export interface IGetLobbyMovesParams {
  lobby_id: string | null | void;
}

/** 'GetLobbyMoves' return type */
export interface IGetLobbyMovesResult {
  contract_address: string | null;
  id: number;
  is_oracle: boolean | null;
  lobby_id: string | null;
  move_entry: string | null;
  move_number: number | null;
  nft_id: string | null;
  wallet: string | null;
}

/** 'GetLobbyMoves' query type */
export interface IGetLobbyMovesQuery {
  params: IGetLobbyMovesParams;
  result: IGetLobbyMovesResult;
}

const getLobbyMovesIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":43,"b":51}]}],"statement":"SELECT * FROM match_moves\nWHERE lobby_id = :lobby_id\nORDER BY id DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM match_moves
 * WHERE lobby_id = :lobby_id
 * ORDER BY id DESC
 * ```
 */
export const getLobbyMoves = new PreparedQuery<IGetLobbyMovesParams,IGetLobbyMovesResult>(getLobbyMovesIR);


/** 'GetNftsForLobby' parameters type */
export interface IGetNftsForLobbyParams {
  lobby_id: string | null | void;
}

/** 'GetNftsForLobby' return type */
export interface IGetNftsForLobbyResult {
  contract_address: string;
  lobby_id: string | null;
  nft_description: string | null;
  nft_id: string;
}

/** 'GetNftsForLobby' query type */
export interface IGetNftsForLobbyQuery {
  params: IGetNftsForLobbyParams;
  result: IGetNftsForLobbyResult;
}

const getNftsForLobbyIR: any = {"usedParamSet":{"lobby_id":true},"params":[{"name":"lobby_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":49}]}],"statement":"SELECT * FROM nft_state\nWHERE lobby_id = :lobby_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM nft_state
 * WHERE lobby_id = :lobby_id
 * ```
 */
export const getNftsForLobby = new PreparedQuery<IGetNftsForLobbyParams,IGetNftsForLobbyResult>(getNftsForLobbyIR);


/** 'GetNftStateForOwner' parameters type */
export interface IGetNftStateForOwnerParams {
  owner: string;
}

/** 'GetNftStateForOwner' return type */
export interface IGetNftStateForOwnerResult {
  contract_address: string;
  lobby_id: string | null;
  nft_description: string | null;
  nft_id: string;
}

/** 'GetNftStateForOwner' query type */
export interface IGetNftStateForOwnerQuery {
  params: IGetNftStateForOwnerParams;
  result: IGetNftStateForOwnerResult;
}

const getNftStateForOwnerIR: any = {"usedParamSet":{"owner":true},"params":[{"name":"owner","required":true,"transform":{"type":"scalar"},"locs":[{"a":109,"b":115}]}],"statement":"SELECT *\nFROM nft_state\nWHERE nft_id IN (\n    SELECT token_id\n    FROM cde_erc721_data\n    WHERE nft_owner = :owner!\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM nft_state
 * WHERE nft_id IN (
 *     SELECT token_id
 *     FROM cde_erc721_data
 *     WHERE nft_owner = :owner!
 * )
 * ```
 */
export const getNftStateForOwner = new PreparedQuery<IGetNftStateForOwnerParams,IGetNftStateForOwnerResult>(getNftStateForOwnerIR);


/** 'GetAllOwnedNftStates' parameters type */
export interface IGetAllOwnedNftStatesParams {
  contract_address: string | null | void;
  nft_id_array: stringArray | null | void;
}

/** 'GetAllOwnedNftStates' return type */
export interface IGetAllOwnedNftStatesResult {
  contract_address: string;
  lobby_id: string | null;
  nft_description: string | null;
  nft_id: string;
}

/** 'GetAllOwnedNftStates' query type */
export interface IGetAllOwnedNftStatesQuery {
  params: IGetAllOwnedNftStatesParams;
  result: IGetAllOwnedNftStatesResult;
}

const getAllOwnedNftStatesIR: any = {"usedParamSet":{"nft_id_array":true,"contract_address":true},"params":[{"name":"nft_id_array","required":false,"transform":{"type":"scalar"},"locs":[{"a":43,"b":55}]},{"name":"contract_address","required":false,"transform":{"type":"scalar"},"locs":[{"a":81,"b":97}]}],"statement":"SELECT *\nFROM nft_state\nWHERE nft_id = ANY(:nft_id_array) AND contract_address = :contract_address"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM nft_state
 * WHERE nft_id = ANY(:nft_id_array) AND contract_address = :contract_address
 * ```
 */
export const getAllOwnedNftStates = new PreparedQuery<IGetAllOwnedNftStatesParams,IGetAllOwnedNftStatesResult>(getAllOwnedNftStatesIR);


