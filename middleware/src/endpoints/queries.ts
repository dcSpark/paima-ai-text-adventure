import type { FailedResult, Result } from 'paima-sdk/paima-mw-core';

import type { LobbyMoves, LobbyNFTs, MatchExecutorData, RoundExecutorData } from '@game/utils';

import {
  buildEndpointErrorFxn,
  OpenWorldMiddlewareErrorCode,
  PaimaMiddlewareErrorCode,
} from '../errors';
import { buildMatchExecutor, buildRoundExecutor } from '../helpers/executors';
import {
  backendQueryGetEmptyLobbyForWallet,
  backendQueryGetLobbies,
  backendQueryLobbyMessages,
  backendQueryMatchExecutor,
  backendQueryNftsForLobby,
  backendQueryNftsForWallet,
  backendQueryRoundExecutor,
} from '../helpers/query-constructors';
import type { MatchExecutor, PackedLobbyMoves, PackedLobbyNFTs, RoundExecutor } from '../types';
import type { MatchState, TickEvent } from '@game/game-logic';
import type { WalletAddress } from 'paima-sdk/paima-utils';

async function getRoundExecutor(
  lobbyId: string,
  roundNumber: number
): Promise<Result<RoundExecutor<MatchState, TickEvent>>> {
  const errorFxn = buildEndpointErrorFxn('getRoundExecutor');

  // Retrieve data:
  let res: Response;
  try {
    const query = backendQueryRoundExecutor(lobbyId, roundNumber);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  let data: RoundExecutorData;
  try {
    data = (await res.json()) as RoundExecutorData;
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }

  // Process data:
  try {
    const executor = buildRoundExecutor(data, roundNumber);
    return {
      success: true,
      result: executor,
    };
  } catch (err) {
    return errorFxn(OpenWorldMiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, err);
  }
}

async function getMatchExecutor(
  lobbyId: string
): Promise<Result<MatchExecutor<MatchState, TickEvent>>> {
  const errorFxn = buildEndpointErrorFxn('getMatchExecutor');

  // Retrieve data:
  let res: Response;
  try {
    const query = backendQueryMatchExecutor(lobbyId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  let data: MatchExecutorData;
  try {
    data = (await res.json()) as MatchExecutorData;
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }

  // Process data:
  try {
    const executor = buildMatchExecutor(data);
    return {
      success: true,
      result: executor,
    };
  } catch (err) {
    return errorFxn(OpenWorldMiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, err);
  }
}

// async function getUserStats(walletAddress: string): Promise<PackedUserStats | FailedResult> {
//   const errorFxn = buildEndpointErrorFxn('getUserStats');

//   let res: Response;
//   try {
//     const query = backendQueryUserStats(walletAddress);
//     res = await fetch(query);
//   } catch (err) {
//     return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
//   }

//   try {
//     const j = (await res.json()) as { stats: UserStats };
//     return {
//       success: true,
//       stats: j.stats,
//     };
//   } catch (err) {
//     return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
//   }
// }

// async function getWorldStats(walletAddress: string): Promise<PackedWorldStats | FailedResult> {
//   const errorFxn = buildEndpointErrorFxn('getWorldStats');

//   let res: Response;
//   try {
//     const query = backendQueryWorldStats();
//     res = await fetch(query);
//   } catch (err) {
//     return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
//   }

//   try {
//     const j = (await res.json()) as { stats: WorldStats[] };
//     return {
//       success: true,
//       stats: j.stats,
//     };
//   } catch (err) {
//     return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
//   }
// }

async function getMyLobbies(): Promise<any | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getMyLobbies');

  let res: Response;
  try {
    const query = backendQueryGetLobbies();
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const lobbies = (await res.json()) as any;
    return {
      success: true,
      lobbies,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getEmptyLobby(walletId: string): Promise<any | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getEmptyLobby');

  let res: Response;
  try {
    const query = backendQueryGetEmptyLobbyForWallet(walletId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const lobby = (await res.json()) as any;
    return {
      success: true,
      lobby,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

// todo; add some pagination
async function getLobbyMoves(lobbyId: string): Promise<PackedLobbyMoves | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getLobbyMoves');

  let res: Response;
  try {
    const query = backendQueryLobbyMessages(lobbyId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const messages = (await res.json()) as LobbyMoves;
    return {
      success: true,
      messages,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getNftsForLobby(lobbyId: string): Promise<PackedLobbyNFTs | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getNftsForLobby');

  let res: Response;
  try {
    const query = backendQueryNftsForLobby(lobbyId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const nfts = (await res.json()) as LobbyNFTs;
    return {
      success: true,
      nfts,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getNftsForWallet(wallet: WalletAddress): Promise<PackedLobbyNFTs | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getNftsForLobby');

  let res: Response;
  try {
    const query = backendQueryNftsForWallet(wallet);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const nfts = (await res.json()) as LobbyNFTs;
    return {
      success: true,
      nfts,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export const queryEndpoints = {
  getRoundExecutor,
  getMatchExecutor,
  getLobbyMoves,
  getNftsForLobby,
  getNftsForWallet,
  getMyLobbies,
  getEmptyLobby,
};
