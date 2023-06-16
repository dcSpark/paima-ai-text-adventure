import { builder } from 'paima-sdk/paima-concise';
import type { OldResult } from 'paima-sdk/paima-mw-core';
import { postConciseData } from 'paima-sdk/paima-mw-core';

import { buildEndpointErrorFxn, PaimaMiddlewareErrorCode } from '../errors';
import type { SubmitMoveInput, JoinNftToLobbyInput } from '@game/utils/src/onChainTypes';

async function submitMoves(input: Omit<SubmitMoveInput, 'input'>): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const cleanInput: Omit<SubmitMoveInput, 'input'> = {
    moveEntry: input.moveEntry,
    nftId: input.nftId,
    lobbyId: input.lobbyId,
    wallet: input.wallet,
    cdeName: input.cdeName,
  };
  const base64Input = Buffer.from(JSON.stringify(cleanInput)).toString('base64');
  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('move');
  conciseBuilder.addValue({ value: base64Input });

  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      return { success: true, message: '' };
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

async function joinNftToLobby(input: Omit<JoinNftToLobbyInput, 'input'>): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('joinNftToLobby');

  const cleanInput: Omit<JoinNftToLobbyInput, 'input'> = {
    lobbyId: input.lobbyId,
    nftId: input.nftId,
    initialDescription: input.initialDescription,
    cdeName: input.cdeName,
  };
  const base64Input = Buffer.from(JSON.stringify(cleanInput)).toString('base64');
  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('join');
  conciseBuilder.addValue({ value: base64Input });

  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      return { success: true, message: '' };
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

export const writeEndpoints = {
  submitMoves,
  joinNftToLobby,
};
