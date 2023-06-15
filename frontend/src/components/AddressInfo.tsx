import React from 'react';
import CopyableAddress from './CopyableAddress';
import { Box, Typography } from '@mui/material';
import { useWeb3Context } from '@src/hooks/useWeb3Context';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

interface Props {
  address?: string;
  network?: string;
}

const AddressInfo = (props: Props) => {
  const web3 = useWeb3Context();
  const connectedWallet = useSelector((state: RootState) => state.app.userWallet);
  const network = props.network ?? web3.networkName;
  const address = props.address ?? connectedWallet.walletAddress;

  return (
    <Box alignSelf="stretch" display="flex" justifyContent="space-between">
      <Typography variant="caption">{network}</Typography>
      <CopyableAddress address={address} />
    </Box>
  );
};

export default AddressInfo;
