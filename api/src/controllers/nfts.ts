import { Controller, Get, Query, Route } from 'tsoa';
import { requirePool, getNftsForLobby, getAllOwnedNftStates } from '@game/db';
import { NFT_CDE, type LobbyNFTs, CDE_CONTRACT_MAPPING } from '@game/utils';
import { getOwnedNfts } from 'paima-sdk/paima-utils-backend';

@Route('nfts')
export class LobbyNFTController extends Controller {
  @Get('lobby')
  public async getLobbyNFTs(@Query() lobby_id: string): Promise<LobbyNFTs> {
    const pool = requirePool();
    const result = await getNftsForLobby.run({ lobby_id }, pool);
    return result;
  }

  @Get('wallet')
  public async getWalletNFTs(@Query() wallet: string): Promise<LobbyNFTs> {
    const pool = requirePool();
    const ownedNFTIDs = await getOwnedNfts(pool, NFT_CDE, wallet);
    const contract_address = CDE_CONTRACT_MAPPING[NFT_CDE];

    const result = await getAllOwnedNftStates.run(
      { nft_id_array: ownedNFTIDs.map(nft => Number(nft).toString()), contract_address },
      pool
    );
    return result;
  }
}
