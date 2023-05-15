import { useWeb3Context } from '../hooks/useWeb3Context';

import ConnectWallet from '../components/SaleComponents/ConnectWallet';
import BuyProgress from '../components/SaleComponents/BuyProgress';
import { NFT_SUPPLY } from '../services/constants';
import React from 'react';
import { Box } from '@mui/material';

const NFTSale = () => {
  const { connected } = useWeb3Context();

  if (!connected) {
    return <ConnectWallet />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <BuyProgress
        imageModal="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
        nftSupply={NFT_SUPPLY}
        // TODO: change tokenId to a real value
        tokenId="10"
      />
    </Box>
  );
};

export default NFTSale;
