// import { Controller, Get, Query, Route } from 'tsoa';
// import { requirePool, getNftsForLobby, getAllOwnedNftStates } from '@game/db';
// import { NFT_CDE, type LobbyNFTs, CDE_CONTRACT_MAPPING } from '@game/utils';
// import { getOwnedNfts } from 'paima-sdk/paima-utils-backend';

import { getLobbySamples, requirePool } from '@game/db';
import { Route, Controller, Get } from 'tsoa';

@Route('lobbies')
export class LobbiesController extends Controller {
  @Get('/')
  public async getSampleLobbies(): Promise<{ id: string }[]> {
    const pool = requirePool();
    const rows = await getLobbySamples.run(undefined, pool);
    return rows.map(row => ({
      id: row.lobby_id,
    }));
  }
}
