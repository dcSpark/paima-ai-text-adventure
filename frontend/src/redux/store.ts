import { LobbyNFTs } from '@game/utils';
import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';

import { Wallet } from 'paima-sdk/paima-mw-core';
import { useDispatch } from 'react-redux';
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import { rtkApi } from './rtkQuery/rootApi';

interface AppState {
  connected: boolean;
  userWallet: Wallet | null;
  lobbyNfts: LobbyNFTs | null;
  selectedNft: string | null;
  joinedLobby: string | null;
  buyModal: boolean;
}

const initialState: AppState = {
  connected: false,
  userWallet: null,
  selectedNft: null,
  joinedLobby: null,
  lobbyNfts: null,
  buyModal: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setUserWallet: (state, action: PayloadAction<Wallet>) => {
      state.userWallet = action.payload;
    },
    setSelectedNft: (state, action: PayloadAction<string | null>) => {
      state.selectedNft = action.payload;
    },
    setJoinedLobby: (state, action: PayloadAction<string | null>) => {
      state.joinedLobby = action.payload;
    },
    setLobbyNfts: (state, action: PayloadAction<LobbyNFTs>) => {
      state.lobbyNfts = action.payload;
    },
    setBuyModal: (state, action: PayloadAction<boolean>) => {
      state.buyModal = action.payload;
    },
  },
});

export const {
  setConnected,
  setUserWallet,
  setSelectedNft,
  setJoinedLobby,
  setLobbyNfts,
  setBuyModal,
} = appSlice.actions;

const reducer = {
  app: appSlice.reducer,
  [rtkApi.nft.reducerPath]: rtkApi.nft.reducer,
  [rtkApi.lobby.reducerPath]: rtkApi.lobby.reducer,
} as const;
export type RootState = { [key in keyof typeof reducer]: ReturnType<typeof reducer[key]> };

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware: CurriedGetDefaultMiddleware) =>
    getDefaultMiddleware().concat([rtkApi.nft.middleware]).concat([rtkApi.lobby.middleware]),
});

type AppDispatch = typeof store['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch;
