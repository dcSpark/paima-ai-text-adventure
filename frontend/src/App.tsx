import * as React from 'react';
import Box from '@mui/material/Box';
import { Container, ThemeProvider } from '@mui/material';

import { theme } from './theme';
import { Lobby } from './pages/Lobby';
import wizardImage from '@assets/wizard_oracle.png';
import { WagmiConfig } from 'wagmi';
import { client } from './hooks/web3-data-provider/wagmi';
import DisconnectModal from './components/DisconnectModal';
import WrongChainModal from './components/WrongChainModal';
import PreCasher from './components/PreCasher';
import { JoinModal } from './pages/JoinModal';
import { LoginModal } from './pages/LoginModal';
import BuyModal from './pages/BuyModal';
import { NoNftModal } from './pages/NoNftModal';

export default function App() {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minWidth: '100vw',
            maxWidth: '100vw',
            minHeight: '100vh',
            maxHeight: '100vh',
            backgroundImage: `url(${wizardImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // this is ambience, whatever you do, don't scroll it
            overflow: 'visible',
            // set global
            color: 'white',
          }}
        >
          <Container
            sx={{
              position: 'relative',
              height: '100vh',
              display: 'flex',
              padding: 4,
            }}
          >
            <PreCasher />
            <DisconnectModal />
            <NoNftModal />
            <WrongChainModal />
            <JoinModal />
            <LoginModal />
            <BuyModal />
            <Lobby />
          </Container>
        </Box>
      </ThemeProvider>
    </WagmiConfig>
  );
}
