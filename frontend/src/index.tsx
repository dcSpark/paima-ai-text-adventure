import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { theme } from './theme';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WagmiConfig } from 'wagmi';

import { Web3ContextProvider } from './hooks/web3-data-provider/Web3Provider';
import { client } from './hooks/web3-data-provider/wagmi';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <WagmiConfig client={client}>
        <Web3ContextProvider>
          <>
            <CssBaseline />
            <HashRouter>
              <App />
            </HashRouter>
          </>
        </Web3ContextProvider>
      </WagmiConfig>
    </Provider>
  </ThemeProvider>
);
