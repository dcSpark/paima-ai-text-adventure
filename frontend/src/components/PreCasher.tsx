import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import React from 'react';

/**
 * Calls rtk queries that we want to get ready as soon as the app starts.
 * This could be a hook, but I like it as a component...
 */
export default function PreCasher(): React.ReactElement {
  rtkApi.nft.endpoints.getNFTPrice.useQuery();
  rtkApi.nft.endpoints.getNftMaxSupply.useQuery();
  rtkApi.nft.endpoints.getCurrentNFT.useQuery();

  return <></>;
}
