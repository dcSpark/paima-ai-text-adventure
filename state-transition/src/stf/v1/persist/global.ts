import type { SQLUpdate } from 'paima-sdk/paima-db';
import type Prando from 'paima-sdk/paima-prando';
import type { ContractAddress, WalletAddress } from 'paima-sdk/paima-utils';
import type {
  IAddMatchMoveParams,
  IJoinNftToLobbyParams,
  IAddOracleMoveParams,
  IUpdateNftStateParams,
  ICreateNftStateParams,
} from '@game/db';
import {
  createNftState,
  addMatchMove,
  joinNftToLobby,
  addOracleMove,
  getNftsForLobby,
  updateNftState,
  getNftState,
} from '@game/db';
import type { ScheduledDataInput, NftMintInput } from '../types';
import { type JoinNftToLobbyInput, type SubmitMoveInput } from '../types';
import { getRandomColor, CDE_CONTRACT_MAPPING } from '@game/utils';
import type { Pool } from 'pg';
import { isNftOwner } from 'paima-sdk/paima-utils-backend';
import { isNftMint } from '../helpers';

export async function joinNftToLobbyId(
  player: WalletAddress,
  blockHeight: number,
  inputData: JoinNftToLobbyInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const contract_address = CDE_CONTRACT_MAPPING[inputData.cdeName];
  if (!contract_address) {
    return [];
  }
  const walletOwnsNFT = await isNftOwner(
    dbConn,
    inputData.cdeName,
    BigInt(inputData.nftId),
    player
  );
  if (!walletOwnsNFT) {
    return [];
  }

  const currentNFTState = await getNftState.run({ nft_id: inputData.nftId }, dbConn);
  const updates = [persistJoinNFTToLobby(inputData.nftId, inputData.lobbyId, contract_address)];
  if (currentNFTState) {
    updates.push(
      persistNewNFTState(inputData.nftId, getRandomColor(randomnessGenerator), contract_address)
    );
  }
  return updates;
}

export const nftMint = async (input: NftMintInput, _owner: WalletAddress): Promise<SQLUpdate[]> => {
  const nftCreateQuery = persistCreatedNFT(input.tokenId, '', input.address);
  return [nftCreateQuery];
};

export const scheduledData = async (
  input: ScheduledDataInput,
  player: WalletAddress
): Promise<SQLUpdate[]> => {
  if (isNftMint(input)) {
    return nftMint(input, player);
  }
  return [];
};

export async function submitMove(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMoveInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const walletOwnsNFT = await isNftOwner(
    dbConn,
    inputData.cdeName,
    BigInt(inputData.nftId),
    player
  );
  if (!walletOwnsNFT) {
    return [];
  }
  const contract_address = CDE_CONTRACT_MAPPING[inputData.cdeName];

  const userMove = persistNewMove(
    inputData.lobbyId,
    inputData.nftId,
    contract_address,
    inputData.moveEntry,
    player
  );
  const oracleMove = persistNewOracleResponse(
    inputData.lobbyId,
    randomnessGenerator.nextString(10)
  );
  const lobbyNFTs = await getNftsForLobby.run({ lobby_id: inputData.lobbyId }, dbConn);

  const nftUpdates = lobbyNFTs.map(nft => {
    return persistNewNFTState(
      nft.nft_id,
      getRandomColor(randomnessGenerator),
      nft.contract_address
    );
  });
  return [userMove, oracleMove, ...nftUpdates];
}

export function persistNewMove(
  lobby_id: string,
  nft_id: string,
  contract_address: ContractAddress,
  move_entry: string,
  player: WalletAddress
): SQLUpdate {
  const params: IAddMatchMoveParams = {
    move_entry,
    lobby_id,
    nft_id,
    wallet: player,
    contract_address,
  };
  return [addMatchMove, params];
}

export function persistNewOracleResponse(lobby_id: string, move_entry: string): SQLUpdate {
  const params: IAddOracleMoveParams = {
    move_entry,
    lobby_id,
  };
  return [addOracleMove, params];
}

export function persistJoinNFTToLobby(
  nft_id: string,
  lobby_id: string,
  contract_address: ContractAddress
): SQLUpdate {
  // if the NFT isn't already in the database, it will be created
  const params: IJoinNftToLobbyParams = {
    nft_id,
    lobby_id,
    contract_address,
  };
  return [joinNftToLobby, params];
}

export function persistNewNFTState(
  nft_id: string,
  nft_description: string,
  contract_address: ContractAddress
): SQLUpdate {
  const params: IUpdateNftStateParams = {
    nft_id,
    nft_description,
    contract_address,
  };
  return [updateNftState, params];
}

export function persistCreatedNFT(
  nft_id: string,
  nft_description: string,
  contract_address: string
): SQLUpdate {
  const params: ICreateNftStateParams = {
    nft_id,
    nft_description,
    contract_address,
  };
  return [createNftState, params];
}
