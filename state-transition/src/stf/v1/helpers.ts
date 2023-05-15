import type { ScheduledDataInput, NftMintInput } from './types';

export function isNftMint(input: ScheduledDataInput): input is NftMintInput {
  return (input as NftMintInput).effect === 'nftMint';
}
