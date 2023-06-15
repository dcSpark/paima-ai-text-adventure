import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useProvider,
  useSwitchNetwork,
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Web3Context } from '../useWeb3Context';
import { supportedChain } from './wagmi';
import type { Provider } from '@wagmi/core';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

export type Web3Data = {
  switchChain: ((chainId?: number) => void) | undefined;
  currentAccount: string;
  connected: boolean;
  loading: boolean;
  provider: Provider;
  chainId: undefined | number;
  networkName: string;
  error: Error | null;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { connect, error } = useConnect({
    connector: new MetaMaskConnector(),
    chainId: supportedChain.id,
  });
  const { disconnect } = useDisconnect();
  const { isConnected, isConnecting, address: account } = useAccount();
  const middlewareConnected = useSelector((state: RootState) => state.app.connected);

  useEffect(() => {
    // (dis)connect wagmi based on connection using middleware
    if (middlewareConnected && !isConnected && !isConnecting) {
      connect();
    }

    if (!middlewareConnected && isConnected) {
      disconnect();
    }
  }, [connect, disconnect, isConnected, isConnecting, middlewareConnected]);

  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const provider = useProvider();

  return (
    <Web3Context.Provider
      value={{
        web3ProviderData: {
          switchChain: switchNetwork,
          provider,
          connected: isConnected,
          loading: isConnecting,
          chainId: chain?.id,
          networkName: chain?.name ?? 'Unknown network',
          currentAccount: account?.toLowerCase() || '',
          error,
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
