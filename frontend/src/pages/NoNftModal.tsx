import { Box, Button, Dialog, Typography, useTheme } from '@mui/material';
import { RootState, setBuyModal } from '@src/redux/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';

export function NoNftModal() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const { data: userNFTs } = rtkApi.nft.endpoints.getNFTsForWallet.useQuery(
    userWallet ? userWallet.walletAddress : skipToken,
    { pollingInterval: 5_000 }
  );
  const open = userNFTs != null && userNFTs.length === 0;

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          border: 'none',
          borderRadius: '4px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(3),
          bgcolor: '#282828',
          border: '12px solid #ffffff33',
          color: 'white',
        }}
      >
        <Typography variant="h2">
          You don't have any Oracle NFTs yet. Go buy one to play!
        </Typography>
        <Box minHeight={theme.spacing(2.5)} />
        <Typography variant="body1">
          If you just bought one, please give us a moment to find it.
        </Typography>
        <Box minHeight={theme.spacing(1.5)} />
        <Button variant="contained" onClick={() => dispatch(setBuyModal(true))}>
          Buy My Character!
        </Button>
      </Box>
    </Dialog>
  );
}
