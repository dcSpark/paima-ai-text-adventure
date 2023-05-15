import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import { requirePool, getLobbyMoves, addMatchMove } from '@game/db';
import type { LobbyMoves } from '@game/utils';

@Route('lobby_moves')
export class LobbyMovesController extends Controller {
  @Get()
  public async get(@Query() lobby_id: string): Promise<LobbyMoves> {
    const pool = requirePool();
    const result = await getLobbyMoves.run({ lobby_id }, pool);
    return result;
  }

  // @Post()
  // public async post(
  //   @Post() lobby_id: string,
  //   nft_id: string,
  //   move_entry: string
  // ): Promise<Response> {
  //   const pool = requirePool();
  //   const result = await addMatchMove.run({ lobby_id, move_entry, nft_id }, pool);
  //   return { moves: result };
  // }
}
