import React, { useState } from 'react';
import { EXPLORER_URL } from '../../services/constants';
import Purchase from './Purchase';
import PurchaseSuccessful from './PurchaseSuccessful';
import PurchasePending from './PurchasePending';
import { useNavigate } from 'react-router-dom';

interface BuyProgressProps {
  titleModal?: string;
  nftName?: string;
  imageModal: string;
  nftSupply: string;
  tokenId: string;
}

const BuyProgress = ({ imageModal, nftSupply, tokenId }: BuyProgressProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [buySuccessful, setBuySuccessful] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');
  const navigate = useNavigate();

  const txIsPending = (hash: string) => {
    setTxHash(hash);
    setIsPending(true);
  };

  const done = () => {
    setIsPending(false);
    setBuySuccessful(true);
    navigate('/join');
  };

  const cancel = () => {
    setIsPending(false);
  };

  if (isPending) {
    return (
      <PurchasePending
        imageModal={imageModal}
        nftSupply={nftSupply}
        tokenId={tokenId}
        explorerURL={`${EXPLORER_URL}/${txHash}`}
      />
    );
  }

  if (buySuccessful) {
    return <PurchaseSuccessful />;
  }

  return (
    <Purchase
      imageModal={imageModal}
      nftSupply={nftSupply}
      tokenId={tokenId}
      txIsPending={txIsPending}
      done={done}
      cancel={cancel}
    />
  );
};

export default BuyProgress;
