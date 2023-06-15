import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import mw from '@game/middleware';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setConnected } from '@src/redux/store';
import { login } from '@src/utils';

export default function DisconnectModal(): React.ReactElement {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [listener, setListener] = useState<number>(undefined);
  const connected = useSelector((state: RootState) => state.app.connected);

  useEffect(() => {
    // listen for disconnect
    if (listener == null && !connected) return; // not before first connect
    if (listener != null) return; // do not set listener again

    setListener(
      window.setInterval(async () => {
        const status = await mw.checkWalletStatus();
        if (!status.success) {
          dispatch(setConnected(false));
          setOpen(true);
        }
      }, 2_000)
    );
  }, [listener, connected, dispatch]);

  useEffect(() => {
    // close if connected
    if (connected) setOpen(false);
  }, [connected]);

  return (
    <Dialog open={open}>
      <DialogTitle>Your wallet is disconnected!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          If a popup doesn't open, see if metamask made a silent notification.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={async () => {
            // note: Metamask usually just makes a silent notification and responds false
            // so the user has to click again after accepting (I don't have a solution for it).
            const success = await login(dispatch);
            if (success) setOpen(false);
          }}
        >
          reconnect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
