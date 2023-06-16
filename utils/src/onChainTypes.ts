import type { WalletAddress } from 'paima-sdk/paima-utils';

export type DataInput = JoinNftToLobbyInput | SubmitMoveInput;
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

export interface ScheduledDataInput {
  input: 'scheduledData';
}

export interface NftMintInput extends ScheduledDataInput {
  effect: 'nftMint';
  tokenId: string;
  // contract address
  address: WalletAddress;
}
