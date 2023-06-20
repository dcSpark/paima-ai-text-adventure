import React, { useState } from 'react';
import { Box, Typography, Link, Button, useTheme, Dialog, CircularProgress } from '@mui/material';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import BigNumber from 'bignumber.js';
import { OpenInNewOutlined } from '@mui/icons-material';
import NftPrice from '@src/components/NftPrice';
import { buyNft } from '@src/services/contract';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setBuyModal } from '@src/redux/store';

enum SaleStep {
  overview,
  pending,
}

const BuyModal = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.app.buyModal);
  const wallet = useSelector((state: RootState) => state.app.userWallet);
  const [step, setStep] = useState<SaleStep>(SaleStep.overview);
  const { data: rawPrice } = rtkApi.nft.endpoints.getNFTPrice.useQuery();
  const price = rawPrice == null ? undefined : new BigNumber(rawPrice);

  if (price == null) return <Box />;

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setBuyModal(false))}
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
        <Typography variant="h2">
          <span style={{ fontWeight: 700 }}>Mint Your NFT</span> and Enter the Enchanted Realms of
          Oracle RPG
        </Typography>
        <Box minHeight={theme.spacing(2.5)} />
        <Typography variant="body1" align="center">
          Welcome, brave soul, to Oracle RPG! To embark on your thrilling adventure, you must mint
          your NFT. Click the button below and let the magic unfold as your NFT is forged, granting
          you access to a realm of fantasy like never before.
        </Typography>
        <Box minHeight={theme.spacing(3)} />
        {step === SaleStep.overview && (
          <>
            <Link
              href="https://faucet-devnet-cardano-evm.c1.milkomeda.com/"
              target="_blank"
              rel="noreferrer"
              color="#ffffff"
            >
              <Typography>
                How to get milkTADA <OpenInNewOutlined fontSize="inherit" />
              </Typography>
            </Link>
            <Box minHeight={theme.spacing(3)} />
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  const tx = await buyNft(wallet.walletAddress);
                  setStep(SaleStep.pending);
                  await tx.wait(3);
                  dispatch(setBuyModal(false));
                } catch {
                  setStep(SaleStep.overview);
                }
              }}
            >
              Mint NFT
            </Button>
            <Box minHeight={theme.spacing(2)} />
            <NftPrice amount={price} />
          </>
        )}
        {step === SaleStep.pending && (
          <>
            <CircularProgress sx={{ color: 'yellowgreen' }} size="64px" />
            <Box minHeight={theme.spacing(4)} />
            <Typography variant="caption">Minting Oracle RPG Character...</Typography>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default BuyModal;
