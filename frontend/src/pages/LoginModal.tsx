import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Dialog, useTheme } from '@mui/material';
import { login } from '@src/utils';
import { RootState } from '@src/redux/store';

export function LoginModal(): React.JSX.Element {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const userWallet = useSelector((state: RootState) => state.app.userWallet);

  useEffect(() => {
    // open self
    setOpen(userWallet == null);
  }, [userWallet]);

  useEffect(() => {
    // auto-login on open
    login(dispatch);
  }, [dispatch]);

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
        <Button variant="contained" onClick={() => login(dispatch)}>
          Connect
        </Button>
      </Box>
    </Dialog>
  );
}
