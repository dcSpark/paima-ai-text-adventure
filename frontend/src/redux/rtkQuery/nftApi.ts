import { LobbyNFTs, LobbyMoves } from '@game/utils';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import mw from '@game/middleware';
import { fetchNftPrice } from '@src/services/contract';

export const nftApi = createApi({
  reducerPath: 'nftApi',
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getNFTsForLobby: builder.query<LobbyNFTs, string>({
      queryFn: async lobby_id => {
        const lobbyData = await mw.getNftsForLobby(lobby_id);
        if (lobbyData.success) {
          return { data: lobbyData.nfts };
        } else {
          return { error: 'Missing lobby data' };
        }
      },
    }),
    getMessagesForLobby: builder.query<LobbyMoves, string>({
      queryFn: async lobby_id => {
        try {
          const lobbyData = await mw.getLobbyMoves(lobby_id);
          if (lobbyData.success) {
            return { data: lobbyData.messages };
          } else {
            return { error: 'Missing lobby data' };
          }
        } catch (e) {
          return { error: 'Missing lobby data' };
        }
      },
    }),
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
    // getUserById: builder.query<User, number>({
    //   queryFn: async id => {
    //     const response = await fetch(`/users/${id}`);
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch user');
    //     }
    //     const data = await response.json();
    //     return data;
    //   },
    // }),
  }),
});
