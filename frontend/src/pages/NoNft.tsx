import { Box, Button, Typography } from '@mui/material';
import { RootState } from '@src/redux/store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import { ROUTES } from '@src/routes';

export function NoNft() {
  const navigate = useNavigate();
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const { data: userNFTs } = rtkApi.nft.endpoints.getNFTsForWallet.useQuery(
    userWallet ? userWallet.walletAddress : skipToken,
    { pollingInterval: 5_000 }
  );

  useEffect(() => {
    // assert: user owns no nft after load
    if (userNFTs == null) return;

    if (userNFTs.length > 0) {
      navigate(ROUTES.JOIN);
    }
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">
          You don't have any Oracle NFTs yet. Go buy one to play!
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.BUY)}>
          Buy My Character!
        </Button>
      </Box>
    </Box>
  );
}
