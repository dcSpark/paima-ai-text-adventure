import type { RoundExecutor, MatchExecutor } from 'paima-sdk/paima-executors';
import type { Hash } from 'paima-sdk/paima-utils';

import type { BaseRoundStatus, LobbyMoves, LobbyNFTs } from '@game/utils';
import type { IGetLobbyMovesResult } from '@game/db';

export type { RoundExecutor, MatchExecutor };

export interface RoundEnd {
  blocks: number;
  seconds: number;
}
export interface RoundExecutionState extends BaseRoundStatus {
  roundEndsInBlocks: number;
  roundEndsInSeconds: number;
}

export interface PackedRoundExecutionState {
  success: true;
  round: RoundExecutionState;
}

export type PackedLobbyMoves = {
  success: true;
  messages: LobbyMoves;
};

export type PackedLobbyNFTs = {
  success: true;
  nfts: LobbyNFTs;
};
