import { LobbyNFTs } from '@game/utils';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import mw from '@game/middleware';
import { fetchCurrentNftTokenId, fetchNftMaxSupply, fetchNftPrice } from '@src/services/contract';

export const nftApi = createApi({
  reducerPath: 'nftApi',
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getNFTsForWallet: builder.query<LobbyNFTs, string>({
      queryFn: async wallet_address => {
        try {
          const walletNFTs = await mw.getNftsForWallet(wallet_address);
          if (walletNFTs.success) {
            return { data: walletNFTs.nfts };
          } else {
            return { error: 'Missing NFT data' };
          }
        } catch (e) {
          return { error: 'Missing NFT data' };
        }
      },
    }),
    getNFTPrice: builder.query<string, void>({
      queryFn: async () => {
        const result = await fetchNftPrice();
        return { data: result.toString() };
      },
    }),
    getCurrentNFT: builder.query<number, void>({
      queryFn: async () => {
        return { data: await fetchCurrentNftTokenId() };
      },
    }),
    getNftMaxSupply: builder.query<number, void>({
      queryFn: async () => {
        return { data: await fetchNftMaxSupply() };
      },
    }),
  }),
});
