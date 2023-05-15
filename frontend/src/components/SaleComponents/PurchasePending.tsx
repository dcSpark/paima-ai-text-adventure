import { ExternalLinkIcon } from '@heroicons/react/outline';

import NFTImage from './NFTImage';
import { useWeb3Context } from '../../hooks/useWeb3Context';
import AddressInfo from './AddressInfo';
import React from 'react';
import { BigNumber } from 'bignumber.js';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import NativeTokenAmount from '../NativeTokenAmount';

interface Props {
  imageModal: string;
  nftSupply: string;
  tokenId: string;
  explorerURL: string;
}

const PurchasePending = ({ imageModal, nftSupply, tokenId, explorerURL }: Props) => {
  const { network, currentAccount } = useWeb3Context();

  const { data: rawPrice } = rtkApi.nftApi.endpoints.getNFTPrice.useQuery();
  const price = rawPrice == null ? undefined : new BigNumber(rawPrice);

  return (
    <div className="flex flex-col gap-8">
      <AddressInfo network={network} address={currentAccount} />
      <NFTImage imageModal={imageModal} status={`#${tokenId}/${nftSupply}`} />
      <div className="flex items-center justify-between">
        <NativeTokenAmount amount={price} />
        <p>Pending...</p>
      </div>
      <div className="flex flex-col items-center">
        <a
          className="cursor-pointer flex items-center"
          href={explorerURL}
          target="_blank"
          rel="noreferrer"
        >
          <p className="font-base text-14 mr-4 underline">Go to Explorer</p>
          <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default PurchasePending;
