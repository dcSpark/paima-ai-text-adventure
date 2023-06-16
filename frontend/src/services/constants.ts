export const RPC_URL: string = process.env.RPC_URL ?? '';
export const NATIVE_NFT_SALE_PROXY: string = process.env.NATIVE_NFT_SALE_PROXY ?? '';
export const NFT: string = process.env.NFT ?? '';
export const EXPLORER_URL: string = process.env.EXPLORER_URL ?? '';
export const CHAIN_ID: number = Number.parseInt(process.env.CHAIN_ID);
export const NETWORK_NAME: string = process.env.NETWORK_NAME ?? '';

export const CHAIN_CURRENCY_DECIMALS: number = Number.parseInt(process.env.CHAIN_CURRENCY_DECIMALS);
export const CHAIN_CURRENCY_TICKER: string = process.env.CHAIN_CURRENCY_TICKER;
export const CHAIN_CURRENCY_LONGNAME: string = process.env.CHAIN_CURRENCY_LONGNAME;
export const IMAGE_AI: string = process.env.IMAGE_AI;

// TODO: we want to get rid of this
export const imagePlaceholder =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
