import type { SQLUpdate } from 'paima-sdk/paima-db';
import type Prando from 'paima-sdk/paima-prando';
import type { ContractAddress, WalletAddress } from 'paima-sdk/paima-utils';
import type {
  IAddMatchMoveParams,
  IJoinNftToLobbyParams,
  IAddOracleMoveParams,
  IUpdateNftStateParams,
  ICreateNftStateParams,
  IGetNftsForLobbyResult,
  IGetMessageHistoryForLobbyResult,
} from '@game/db';
import {
  createNftState,
  addMatchMove,
  joinNftToLobby,
  addOracleMove,
  updateNftState,
  getNftState,
  getMessageHistoryForLobby,
  getNftsForLobby,
} from '@game/db';
import { CDE_CONTRACT_MAPPING, NFT_CDE, ORACLE_AI } from '@game/utils';
import type { Pool } from 'pg';
import { isNftOwner } from 'paima-sdk/paima-utils-backend';
import { isNftMint } from '../helpers';
import type {
  JoinNftToLobbyInput,
  NftMintInput,
  ScheduledDataInput,
  SubmitMoveInput,
} from '@game/utils/src/onChainTypes';
import axios from 'axios';

export async function joinNftToLobbyId(
  player: WalletAddress,
  blockHeight: number,
  inputData: JoinNftToLobbyInput,
  dbConn: Pool,
  _randomnessGenerator: Prando
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
      persistNewNFTState(inputData.nftId, inputData.initialDescription, contract_address)
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

function formatChatHistory(req: {
  entries: Array<IGetMessageHistoryForLobbyResult>;
  oracleName: string;
}) {
  return req.entries
    .map(entry => `${entry.nft_id ?? req.oracleName}: ${entry.move_entry}`)
    .join('\n');
}

function formatDescriptions(req: { entries: Array<IGetNftsForLobbyResult> }) {
  return req.entries.map(entry => `${entry.nft_id}: ${entry.nft_description}`).join('\n');
}

export async function submitMove(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMoveInput,
  dbConn: Pool,
  _randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const updates: SQLUpdate[] = [];
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

  updates.push(
    persistNewMove(
      inputData.lobbyId,
      inputData.nftId,
      contract_address,
      inputData.moveEntry,
      player
    )
  );

  const chatHistoryFromDb = await getMessageHistoryForLobby.run(
    { lobby_id: inputData.lobbyId },
    dbConn
  );

  const lobbyNfts = await getNftsForLobby.run({ lobby_id: inputData.lobbyId }, dbConn);

  const oracleName = 'oracle';
  let chatHistory = formatChatHistory({
    oracleName,
    entries: [...chatHistoryFromDb, { nft_id: inputData.nftId, move_entry: inputData.moveEntry }],
  });

  const oraclePrompt = [
    `This is a conversation between numbered players and a narrator called ${oracleName}:`,
    '',
    chatHistory,
    '',
    `Generate the next response from ${oracleName}.`,
  ].join('\n');
  const oracleAiResponse = await axios.post(
    ORACLE_AI,
    { prompt: oraclePrompt },
    { headers: { 'Content-Type': 'application/json' } }
  );
  const oracleResponse =
    oracleAiResponse.status === 200 && typeof oracleAiResponse.data?.response === 'string'
      ? oracleAiResponse.data.response
      : 'Godzilla Had a Stroke Trying to Read This and F*ing Died';
  updates.push(persistNewOracleResponse(inputData.lobbyId, oracleResponse));

  chatHistory = formatChatHistory({
    oracleName,
    entries: [
      ...chatHistoryFromDb,
      { nft_id: inputData.nftId, move_entry: inputData.moveEntry },
      { nft_id: null, move_entry: oracleResponse },
    ],
  });
  const descriptions = formatDescriptions({ entries: lobbyNfts });
  // TODO: try Promise.all, but we don't know how the AI service handles concurrency yet
  for (const nft of lobbyNfts) {
    const descriptionPrompt = [
      `I will give you the conversation between numbered players and a narrator called ${oracleName}.`,
      `I will give you the current descriptions of the numbered players.`,
      `Generate a new description for player ${nft.nft_id}, at most 50 words long, only slightly different from their previous description.`,
      '',
      `This is the conversation between numbered players and a narrator called ${oracleName}:`,
      chatHistory,
      '',
      `These are the current descriptions of the numbered players:`,
      descriptions,
    ].join('\n');

    const descriptionAiResponse = await axios.post(
      ORACLE_AI,
      { prompt: descriptionPrompt },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newDescription =
      descriptionAiResponse.status === 200 &&
      typeof descriptionAiResponse.data?.response === 'string' &&
      descriptionAiResponse.data.response.length > 0
        ? descriptionAiResponse.data.response
        : nft.nft_description;
    console.log('HELLO', newDescription);

    updates.push(persistNewNFTState(nft.nft_id, newDescription, CDE_CONTRACT_MAPPING[NFT_CDE]));
  }

  return updates;
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
