import type {
  DataInput,
  JoinNftToLobbyInput,
  NftMintInput,
  ScheduledDataInput,
  SubmitMoveInput,
} from '@game/utils/src/onChainTypes';

// Type-check function generating libraries like typia or typescript-is require
// a transformer, which requires tsc. We use esbuild instead of tsc
// so we are stuck with this.
// https://github.com/evanw/esbuild/issues/1963

export function isNftMint(input: ScheduledDataInput): input is NftMintInput {
  return (input as NftMintInput).effect === 'nftMint';
}

export function isJoinNftToLobbyInput(input: unknown): input is JoinNftToLobbyInput {
  return (
    typeof input === 'object' &&
    input != null &&
    'input' in input &&
    typeof input.input === 'string' &&
    'lobbyId' in input &&
    typeof input.lobbyId === 'string' &&
    'nftId' in input &&
    typeof input.nftId === 'string' &&
    'initialDescription' in input &&
    typeof input.initialDescription === 'string' &&
    'cdeName' in input &&
    typeof input.cdeName === 'string'
  );
}

export function isSubmitMoveInput(input: unknown): input is SubmitMoveInput {
  return (
    typeof input === 'object' &&
    input != null &&
    'input' in input &&
    typeof input.input === 'string' &&
    'moveEntry' in input &&
    typeof input.moveEntry === 'string' &&
    'nftId' in input &&
    typeof input.nftId === 'string' &&
    'lobbyId' in input &&
    typeof input.lobbyId === 'string' &&
    'wallet' in input &&
    typeof input.wallet === 'string' &&
    'cdeName' in input &&
    typeof input.cdeName === 'string'
  );
}

export function isDataInput(input: unknown): input is DataInput {
  return isJoinNftToLobbyInput(input) || isSubmitMoveInput(input);
}
