import { InfoOutlined } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import React from 'react';

export default function AvailableNftId() {
  const { data: supply } = rtkApi.nft.endpoints.getNftMaxSupply.useQuery();
  const { data: tokenId } = rtkApi.nft.endpoints.getCurrentNFT.useQuery(undefined, {
    pollingInterval: 10_000,
  });

  return (
    <Typography variant="caption">
      #{tokenId}/{supply}{' '}
      <Tooltip title="We cannot guarantee that this specific NFT will be minted. If two mints happen at the same time, one of them will get the next nft.">
        <InfoOutlined sx={{ fontSize: '1.5em', verticalAlign: 'text-bottom' }} />
      </Tooltip>
    </Typography>
  );
}
