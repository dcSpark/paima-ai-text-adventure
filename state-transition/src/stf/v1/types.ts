import type { WalletAddress } from 'paima-sdk/paima-utils';

export type ParsedSubmittedInput =
  | InvalidInput
  | SubmitMoveInput
  | SubmitIncrementInput
  | JoinWorldInput
  | JoinNftToLobbyInput
  | NftMintInput;
export interface InvalidInput {
  input: 'invalidString';
}

export interface JoinWorldInput {
  input: 'joinWorld';
}

export interface JoinNftToLobbyInput {
  input: 'joinNftToLobby';
  lobbyId: string;
  nftId: string;
  initialDescription: string;
  cdeName: string;
}

export interface SubmitMoveInput {
  input: 'submitMove';
  moveEntry: string;
  nftId: string;
  lobbyId: string;
  wallet: WalletAddress;
  cdeName: string;
}
export interface SubmitIncrementInput {
  input: 'submitIncrement';
  x: number;
  y: number;
}

export interface ScheduledDataInput {
  input: 'scheduledData';
}

export interface NftMintInput extends ScheduledDataInput {
  effect: 'nftMint';
  tokenId: string;
  // contract address
  address: WalletAddress;
}
