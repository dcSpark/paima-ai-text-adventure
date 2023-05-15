import type { Signer } from '@ethersproject/abstract-signer';
import type { Contract } from 'ethers';
import { BigNumber as EthersBigNumber, providers } from 'ethers';

import { NATIVE_NFT_SALE_PROXY, RPC_URL } from './constants';
import type { Characters } from './utils';
import { characterToNumberMap } from './utils';
import { NativeNftSale__factory } from '@src/typechain';
import BigNumber from 'bignumber.js';

declare let window: any;

export type SignerProvider = Signer | providers.Provider;

export const DECIMALS = EthersBigNumber.from(10).pow(18);

export const getSignerOrProvider = (account?: string): SignerProvider => {
  let signerOrProvider;

  if (account) {
    const provider = new providers.Web3Provider(window.ethereum);
    signerOrProvider = provider.getSigner();
  } else {
    const provider = new providers.JsonRpcProvider(RPC_URL);
    signerOrProvider = provider;
  }

  return signerOrProvider;
};

export const NativeNftSaleProxyContract = (
  signer: SignerProvider = getSignerOrProvider()
): Contract => {
  return NativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, signer);
};

export async function fetchNftPrice(): Promise<BigNumber> {
  const contract = NativeNftSale__factory.connect(NATIVE_NFT_SALE_PROXY, getSignerOrProvider());
  const result: EthersBigNumber = await contract.nftPrice();
  return new BigNumber(result.toString());
}

export const buyNft = async (account: string, character: Characters) => {
  const signer = getSignerOrProvider(account);
  const nativeNftSaleProxyContract = NativeNftSaleProxyContract(signer);
  const tokenPrice = await nativeNftSaleProxyContract.nftPrice();

  const provider = getSignerOrProvider();
  const gasPrice = await provider.getGasPrice();

  const characterNumber = characterToNumberMap[character];
  const tx = await nativeNftSaleProxyContract.buyNft(account, characterNumber, {
    gasPrice,
    gasLimit: 800000,
    value: tokenPrice.toString(),
  });
  return tx;
};
