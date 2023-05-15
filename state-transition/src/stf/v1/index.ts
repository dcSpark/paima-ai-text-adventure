import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from 'paima-sdk/paima-prando';
import type { SubmittedChainData } from 'paima-sdk/paima-utils';
import type { SQLUpdate } from 'paima-sdk/paima-db';
import { submitMove, joinNftToLobbyId, scheduledData } from './persist/global.js';
// import mw from '@game/middleware';

export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  const user = inputData.userAddress.toLowerCase();
  const input = parse(inputData.inputData);

  switch (input.input) {
    case 'submitMove':
      return submitMove(user, blockHeight, input, dbConn, randomnessGenerator);
    case 'joinNftToLobby':
      return joinNftToLobbyId(user, blockHeight, input, dbConn, randomnessGenerator);

    case 'scheduledData':
      if (!inputData.scheduled) return [];
      return scheduledData(input, user);

    default:
      return [];
  }
}
