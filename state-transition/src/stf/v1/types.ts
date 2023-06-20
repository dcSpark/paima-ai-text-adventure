import type {
  CreateLobbyInput,
  JoinNftToLobbyInput,
  NftMintInput,
  SubmitMoveInput,
} from '@game/utils/src/onChainTypes';

export type ParsedSubmittedInput =
  | InvalidInput
  | SubmitMoveInput
  | JoinNftToLobbyInput
  | NftMintInput
  | CreateLobbyInput;

export interface InvalidInput {
  input: 'invalidString';
}
