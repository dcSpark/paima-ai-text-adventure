import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { theme } from './theme';
import { Lobby } from './pages/Lobby';
import { Login } from './pages/Login';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import wizardImage from '@assets/wizard_oracle.png';
import { Join } from './pages/Join';
import { WagmiConfig } from 'wagmi';
import { client } from './hooks/web3-data-provider/wagmi';
import NFTSale from './pages/NFTSale';
import DisconnectModal from './components/DisconnectModal';
import WrongChainModal from './components/WrongChainModal';
import PreCasher from './components/PreCasher';
import { NoNft } from './pages/NoNft';
import { ROUTES } from './routes';

export default function App() {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.app.userWallet);
  React.useEffect(() => {
    if (!currentUser) {
      navigate(ROUTES.ROOT);
    }
  }, [currentUser, navigate]);

  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={theme}>
        <Box
          minWidth="100vw"
          maxWidth="100vw"
          minHeight="100vh"
          maxHeight="100vh"
          // this is ambience, whatever you do, don't scroll it
          overflow="visible"
          // stolen from flint
          bgcolor="#29293E"
        >
          <Container
            sx={{
              position: 'relative',
              height: '100vh',
              width: '100vw',
              display: 'flex',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: '0',
                backgroundImage: `url(${wizardImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: '0.25',
                width: '100%',
                height: '100%',
              }}
            />
            <Box
              sx={{
                fontFamily: 'cinzel-decorative, sherif',
                flex: 'auto',
                margin: 4,
                padding: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(119, 109, 104, 0.5)',
                color: 'white',
              }}
            >
              <PreCasher />
              <DisconnectModal />
              <WrongChainModal />
              <Typography variant="h4" component="h1" gutterBottom>
                Oracle RPG
              </Typography>

              <Routes>
                <Route element={<Login />} path={ROUTES.ROOT} />
                <Route element={<Join />} path={ROUTES.JOIN} />
                <Route element={<NoNft />} path={ROUTES.NO_NFT} />
                <Route element={<Lobby />} path={ROUTES.LOBBY} />
                <Route element={<NFTSale />} path={ROUTES.BUY} />
              </Routes>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </WagmiConfig>
  );
}
