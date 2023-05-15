import React, { useCallback, useEffect } from 'react';
import mw from '@game/middleware';
import { useDispatch } from 'react-redux';

import { Box, Button } from '@mui/material';
import { setUserWallet } from '@src/redux/store';
import { useNavigate } from 'react-router-dom';

export function Login(): React.JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const updateWallet = useCallback(() => {
    mw.userWalletLogin('metamask').then(walletResult => {
      if (walletResult.success) {
        dispatch(setUserWallet(walletResult.result));
        navigate('/join');
      }
    });
  }, [dispatch, navigate]);
  useEffect(() => {
    updateWallet();
  }, [updateWallet]);
  return (
    <Box>
      <Button variant="contained" onClick={updateWallet}>
        Connect
      </Button>
    </Box>
  );
}
