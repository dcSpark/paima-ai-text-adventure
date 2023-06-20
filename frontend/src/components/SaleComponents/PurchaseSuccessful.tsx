import React from 'react';
import { useWeb3Context } from '../../hooks/useWeb3Context';
import AddressInfo from './AddressInfo';

const PurchaseSuccessful = () => {
  const { network, currentAccount } = useWeb3Context();

  return (
    <div className="flex flex-col gap-8">
      <AddressInfo network={network} address={currentAccount} />
      <h3 className="text-28 leading-9 font-bold font-heading text-center">Congrats!</h3>
      <p className="text-16 text-center">You have successfully purchased a Character NFT!</p>
    </div>
  );
};

export default PurchaseSuccessful;
