import React, { useState } from 'react';
import { Box, Typography, Link, Button, useTheme } from '@mui/material';
import { EXPLORER_URL } from '@src/services/constants';
import { useNavigate } from 'react-router-dom';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import BigNumber from 'bignumber.js';
import { OpenInNewOutlined } from '@mui/icons-material';
import NativeTokenAmount from '@src/components/NativeTokenAmount';
import AddressInfo from '@src/components/AddressInfo';
import { buyNft } from '@src/services/contract';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { ROUTES } from '@src/routes';

enum SaleStep {
  overview,
  pending,
  success,
}

const title: Record<SaleStep, string> = {
  [SaleStep.overview]: 'Mint your NFT to start playing',
  [SaleStep.pending]: 'Transaction pending...',
  [SaleStep.success]: 'Congrats! You have successfully purchased a Character NFT!',
};

const NFTSale = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const wallet = useSelector((state: RootState) => state.app.userWallet);
  const [step, setStep] = useState<SaleStep>(SaleStep.overview);
  const [txHash, setTxHash] = useState<undefined | string>(undefined);
  const { data: rawPrice } = rtkApi.nft.endpoints.getNFTPrice.useQuery();
  const price = rawPrice == null ? undefined : new BigNumber(rawPrice);

  if (price == null) return <Box />;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={theme.breakpoints.values.sm}
    >
      <Typography variant="h4" align="center">
        {title[step]}
      </Typography>
      <AddressInfo />
      {step === SaleStep.overview && (
        <>
          <NativeTokenAmount amount={price} />
          <Link
            href="https://faucet-devnet-cardano-evm.c1.milkomeda.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Typography>
              How to get milkTADA <OpenInNewOutlined fontSize="inherit" />
            </Typography>
          </Link>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const tx = await buyNft(wallet.walletAddress);
                setTxHash(tx.hash);
                setStep(SaleStep.pending);
                await tx.wait(3);
                setStep(SaleStep.success);
              } catch {
                setStep(SaleStep.overview);
              }
            }}
          >
            Mint Your Character
          </Button>
        </>
      )}
      {(step === SaleStep.pending || step === SaleStep.success) && (
        <>
          <Link href={`${EXPLORER_URL}/${txHash}`} target="_blank" rel="noreferrer">
            <Typography variant="caption" component="span">
              Go to Explorer <OpenInNewOutlined fontSize="inherit" />
            </Typography>
          </Link>
        </>
      )}
      {step === SaleStep.success && (
        <>
          <Button
            variant="contained"
            onClick={() => {
              navigate(ROUTES.JOIN);
            }}
          >
            back to main menu
          </Button>
        </>
      )}
    </Box>
  );
};

export default NFTSale;
