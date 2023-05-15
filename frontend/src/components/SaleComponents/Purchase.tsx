import { useWeb3Context } from '../../hooks/useWeb3Context';
import { buyNft } from '../../services/contract';
import { CHAIN_ID, NFT } from '../../services/constants';
import NFTImage from './NFTImage';

import AddressInfo from './AddressInfo';
import { useState } from 'react';
import type { Characters } from '../../services/utils';
import { characters } from '../../services/utils';
import React from 'react';
import { Box, Button, Container, Link, MenuItem, Select, Typography } from '@mui/material';
import { OpenInNewOutlined } from '@mui/icons-material';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import BigNumber from 'bignumber.js';
import NativeTokenAmount from '../NativeTokenAmount';

interface Props {
  imageModal: string;
  nftSupply: string;
  tokenId: string;
  txIsPending: (arg0: string) => void;
  done: () => void;
  cancel: () => void;
}

const Purchase = ({ imageModal, nftSupply, tokenId, txIsPending, done, cancel }: Props) => {
  const [character, setCharacter] = useState<Characters>(characters[0]);
  const { connected, currentAccount, network, chainId, switchChain } = useWeb3Context();

  const { data: rawPrice } = rtkApi.nftApi.endpoints.getNFTPrice.useQuery();
  const price = rawPrice == null ? undefined : new BigNumber(rawPrice);

  const buy = async () => {
    if (!connected) return;

    try {
      const tx = await buyNft(currentAccount, character);
      txIsPending(tx.hash);
      await tx.wait(3);
      done();
    } catch {
      cancel();
    }
  };

  if (rawPrice == null) return <Box />;

  const intendedChain = parseInt(CHAIN_ID);

  return (
    <Container
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      maxWidth="sm"
    >
      <AddressInfo network={network} address={NFT} />
      <Typography variant="h4" component="h1" gutterBottom>
        Mint your NFT to start playing
      </Typography>
      <NFTImage imageModal={imageModal} status={`#${tokenId}/${nftSupply}`} />

      <Box flex="auto">
        <NativeTokenAmount amount={price} />
        <Select value={character} onChange={e => setCharacter(e.target.value as Characters)}>
          {characters.map(character => (
            <MenuItem value={character} key={character}>
              {character}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Link
        href="https://faucet-devnet-cardano-evm.c1.milkomeda.com/"
        target="_blank"
        rel="noreferrer"
      >
        <Typography>
          How to get milkTADA <OpenInNewOutlined fontSize="inherit" />
        </Typography>
      </Link>
      {chainId !== intendedChain ? (
        <Button onClick={() => switchChain?.(intendedChain)} disabled={!connected}>
          Switch network
        </Button>
      ) : (
        <Button variant="contained" onClick={buy} disabled={!connected}>
          Mint Your Character
        </Button>
      )}
    </Container>
  );
};

export default Purchase;
