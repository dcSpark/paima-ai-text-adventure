import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button } from '@mui/material';
import { RootState } from '@src/redux/store';
import { useNavigate } from 'react-router-dom';
import { login } from '@src/utils';
import { ROUTES } from '@src/routes';

export function Login(): React.JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userWallet = useSelector((state: RootState) => state.app.userWallet);

  useEffect(() => {
    // navigate out when logged in
    if (userWallet != null) {
      navigate(ROUTES.JOIN);
    }
  }, [navigate, userWallet]);

  useEffect(() => {
    // auto-login on open
    login(dispatch);
  }, [dispatch]);

  return (
    <Box>
      <Button variant="contained" onClick={() => login(dispatch)}>
        Connect
      </Button>
    </Box>
  );
}
