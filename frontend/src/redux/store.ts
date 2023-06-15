import { LobbyNFTs } from '@game/utils';
import {
  createSlice,
  PayloadAction,
  configureStore,
  MiddlewareArray,
  Middleware,
} from '@reduxjs/toolkit';

import { Wallet } from 'paima-sdk/paima-mw-core';
import { rtkApi } from './rtkQuery/rootApi';

interface AppState {
  connected: boolean;
  userWallet: Wallet | null;
  lobbyNfts: LobbyNFTs | null;
  selectedNft: string | null;
  joinedLobby: string | null;
}

const initialState: AppState = {
  connected: false,
  userWallet: null,
  selectedNft: null,
  joinedLobby: null,
  lobbyNfts: null,
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
  },
});

export const { setConnected, setUserWallet, setSelectedNft, setJoinedLobby, setLobbyNfts } =
  appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    ...Object.fromEntries(Object.values(rtkApi).map(api => [api.reducerPath, api.reducer])),
  },
  middleware: getDefaultMiddleware =>
    (() => {
      let reduxMiddleware: MiddlewareArray<Middleware[]> = getDefaultMiddleware();
      for (const api of Object.values(rtkApi)) {
        reduxMiddleware = reduxMiddleware.concat(api.middleware);
      }
      return reduxMiddleware;
    })(),
});

export type RootState = ReturnType<typeof store.getState>;
