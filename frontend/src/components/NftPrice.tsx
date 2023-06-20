import { Typography } from '@mui/material';
import { CHAIN_CURRENCY_DECIMALS, CHAIN_CURRENCY_TICKER } from '@src/services/constants';
import BigNumber from 'bignumber.js';
import React from 'react';

export default function NftPrice({ amount }: { amount: BigNumber }): React.ReactElement {
  return (
    <Typography variant="caption">
      Price: {amount.shiftedBy(-CHAIN_CURRENCY_DECIMALS).toFormat()} {CHAIN_CURRENCY_TICKER}
    </Typography>
  );
}
