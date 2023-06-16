import type {
  JoinNftToLobbyInput,
  NftMintInput,
  SubmitMoveInput,
} from '@game/utils/src/onChainTypes';

export type ParsedSubmittedInput =
  | InvalidInput
  | SubmitMoveInput
  | JoinNftToLobbyInput
  | NftMintInput;
export interface InvalidInput {
  input: 'invalidString';
}
