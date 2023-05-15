type VersionString = `${number}.${number}.${number}`;
const VERSION_MAJOR = 1;
const VERSION_MINOR = 1;
const VERSION_PATCH = 1;
export const gameBackendVersion: VersionString = `${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const GAME_NAME = 'Paima OpenWorld';
export const PRACTICE_BOT_ADDRESS = '0x0';
export const NFT_CDE = 'OracleNFT';
export const CDE_CONTRACT_MAPPING: Record<string, string> = {
  [NFT_CDE]: '0x7505bB649C0fdBd908Fa577EbB93514B6bceFEcF',
};

export * from './types.js';
export * from './methods.js';
