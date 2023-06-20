import { builder } from 'paima-sdk/paima-concise';
import type { OldResult } from 'paima-sdk/paima-mw-core';
import { getActiveAddress, postConciseData } from 'paima-sdk/paima-mw-core';
import { buildEndpointErrorFxn, PaimaMiddlewareErrorCode } from '../errors';
import type { SubmitMoveInput, JoinNftToLobbyInput } from '@game/utils/src/onChainTypes';
import { getEmptyLobby } from './queries';

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

async function createLobby(nftId: string): Promise<any> {
  const errorFxn = buildEndpointErrorFxn('createLobby');
  const userWalletAddress = getActiveAddress();

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('c');
  conciseBuilder.addValue({ value: nftId });

  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      for (let retries = 0; retries < 5; retries++) {
        const lobby = await getEmptyLobby(userWalletAddress);
        if (lobby) return { success: true, lobby: lobby.lobby };
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      return { success: true, lobby: null };
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
  createLobby,
};
