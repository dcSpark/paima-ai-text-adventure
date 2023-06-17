import { LobbyNFTs, LobbyMoves } from '@game/utils';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import mw from '@game/middleware';
import axios from 'axios';
import { Tags } from './rtkTags';
import { IMAGE_AI } from '@src/services/constants';

type Description = string;
type Image = string;

const imageCache = new Map<Description, Image>();

export const lobbyApi = createApi({
  reducerPath: 'lobbyApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(Tags),
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
    fetchImages: builder.mutation<boolean, Description[]>({
      queryFn: async descriptions => {
        let hadUpdates = false;
        const set = new Set(descriptions);
        for (const description of Array.from(set.values())) {
          if (imageCache.get(description) != null) continue;

          const response = await axios.post(
            IMAGE_AI,
            { prompt: description },
            {
              headers: { 'Content-Type': 'application/json' },
              responseType: 'arraybuffer',
            }
          );
          if (response.status === 200) {
            hadUpdates = true;
            imageCache.set(description, Buffer.from(response.data, 'binary').toString('base64'));
          }
        }
        return { data: hadUpdates };
      },
      invalidatesTags: hadUpdates => (hadUpdates ? [Tags.characterImages] : []),
    }),
    getImages: builder.query<Record<Description, undefined | Image>, Description[]>({
      queryFn: async descriptions => {
        return {
          data: Object.fromEntries(
            descriptions.map(description => [description, imageCache.get(description)])
          ),
        };
      },
      providesTags: [Tags.characterImages],
    }),
  }),
});
