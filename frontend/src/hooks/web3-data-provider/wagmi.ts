import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import type { Chain } from 'wagmi';
import { configureChains, createClient, createStorage } from 'wagmi';
import {
  CHAIN_ID,
  EXPLORER_URL,
  NETWORK_NAME,
  RPC_URL,
  CHAIN_CURRENCY_TICKER,
  CHAIN_CURRENCY_LONGNAME,
  CHAIN_CURRENCY_DECIMALS,
} from '../../services/constants';

export const supportedChain: Chain = {
  id: Number(CHAIN_ID),
  name: NETWORK_NAME,
  network: NETWORK_NAME,
  nativeCurrency: {
    name: CHAIN_CURRENCY_LONGNAME,
    symbol: CHAIN_CURRENCY_TICKER,
    decimals: CHAIN_CURRENCY_DECIMALS,
  },
  rpcUrls: {
    public: { http: [RPC_URL] },
    default: { http: [RPC_URL] },
  },
  blockExplorers: {
    etherscan: { name: '', url: '' },
    default: {
      name: '',
      url: EXPLORER_URL,
    },
  },
};
export const { provider, webSocketProvider } = configureChains(
  [supportedChain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: RPC_URL,
      }),
    }),
  ]
);

export const client = createClient({
  autoConnect: true,
  ...(typeof window !== 'undefined' && {
    storage: createStorage({
      storage: window.localStorage,
      key: 'ps.volcanners',
    }),
  }),
  provider,
  webSocketProvider,
});
