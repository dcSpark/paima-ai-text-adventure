import React, { useEffect } from 'react';
import { useWeb3Context } from '../../hooks/useWeb3Context';
import { Button } from '@mui/material';

const ConnectWallet = () => {
  const { connectWallet } = useWeb3Context();
  useEffect(() => {
    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <h2 className="text-28 leading-9 font-bold font-heading">Connect your wallet</h2>
      <p>Connect your wallet to buy an NFT</p>
      <Button variant="outlined" onClick={connectWallet}>
        Connect
      </Button>
    </>
  );
};

export default ConnectWallet;
