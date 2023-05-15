import { LobbyNFTs } from '@game/utils';
import {
  createSlice,
  PayloadAction,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';

import { Wallet } from 'paima-sdk/paima-mw-core';
import mw from '@game/middleware';
import { nftApi } from './rtkQuery/nftApi';

interface AppState {
  userWallet: Wallet | null;
  userNFTs: LobbyNFTs | null;
  lobbyNFTs: LobbyNFTs | null;
  selectedNFT: string | null;
  joinedLobby: string | null;
}

const initialState: AppState = {
  userWallet: null,
  userNFTs: null,
  selectedNFT: null,
  joinedLobby: null,
  lobbyNFTs: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserWallet: (state, action: PayloadAction<Wallet>) => {
      state.userWallet = action.payload;
    },
    setUserNFTs: (state, action: PayloadAction<LobbyNFTs>) => {
      state.userNFTs = action.payload;
    },
    setSelectedNFT: (state, action: PayloadAction<string | null>) => {
      state.selectedNFT = action.payload;
    },
    setJoinedLobby: (state, action: PayloadAction<string | null>) => {
      state.joinedLobby = action.payload;
    },
    setLobbyNFTs: (state, action: PayloadAction<LobbyNFTs>) => {
      state.lobbyNFTs = action.payload;
    },
  },
});

export const { setUserWallet, setUserNFTs, setSelectedNFT, setJoinedLobby, setLobbyNFTs } =
  appSlice.actions;

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
listenerMiddleware.startListening({
  actionCreator: setUserWallet,
  effect: async (action, listenerApi) => {
    // Run whatever additional side-effect-y logic you want here

    // Can cancel other running instances
    listenerApi.cancelActiveListeners();

    // Run async logic
    const data = await mw.getNftsForWallet(action.payload.walletAddress);

    // Pause until action dispatched or state changed

    // Use the listener API methods to dispatch, get state,
    // unsubscribe the listener, start child tasks, and more
    if (data.success) {
      listenerApi.dispatch(setUserNFTs(data.nfts));
    }
  },
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    [nftApi.reducerPath]: nftApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(nftApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
