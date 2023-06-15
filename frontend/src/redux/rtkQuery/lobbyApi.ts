import { LobbyNFTs, LobbyMoves } from '@game/utils';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import mw from '@game/middleware';

export const lobbyApi = createApi({
  reducerPath: 'lobbyApi',
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
  }),
});
