import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { useWeb3Context } from '@src/hooks/useWeb3Context';
import { CHAIN_ID } from '@src/services/constants';

export default function WrongChainModal(): React.ReactElement {
  const { connected, chainId, switchChain } = useWeb3Context();
  const open = connected && chainId !== CHAIN_ID;

  return (
    <Dialog open={open}>
      <DialogTitle>You are connected with the wrong network, chainId: {chainId}</DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            switchChain?.(CHAIN_ID);
          }}
        >
          switch chain
        </Button>
      </DialogActions>
    </Dialog>
  );
}
