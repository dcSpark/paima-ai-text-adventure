## Deploying contracts

Follow the paima engine docs and deploy default contracts. You should get 4 contracts:
 - l2 contract / game contract
 - nft
 - native nft sale
 - native nft sale proxy

Update your .env file:
 - CONTRACT_ADDRESS, START_BLOCKHEIGHT (l2 deploy), NATIVE_NFT_SALE_PROXY (addr), NFT (addr), NFT_SUPPLY

Update your extensions.yml (in parent folder, it gets copied there from repo folder during init):
 - contractAddress (nft), startBlockHeight (nft deploy)

Update `utils/src/index.ts`
 - CDE_CONTRACT_MAPPING.NFT_CDE (nft addr)

## Ethers types

If we decide to change contracts, ethers types are generated from abis in frontend using:  
`npx typechain --target=ethers-v5 'src/abis/*.json' --out-dir src/stuff`  
We shouldn't have to do it again if we keep using default contracts.