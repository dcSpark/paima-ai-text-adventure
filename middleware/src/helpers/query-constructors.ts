import type { WalletAddress } from 'paima-sdk/paima-utils';
import type { QueryOptions } from 'paima-sdk/paima-mw-core';
import { buildBackendQuery } from 'paima-sdk/paima-mw-core';

export function backendQueryUserStats(wallet: WalletAddress): string {
  const endpoint = 'user_stats';
  const options = {
    wallet,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryWorldStats(): string {
  const endpoint = 'world_state';
  const options = {};
  return buildBackendQuery(endpoint, options);
}

export function backendQueryRoundExecutor(lobbyID: string, round: number): string {
  const endpoint = 'round_executor';
  const options = {
    lobbyID,
    round,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryMatchExecutor(lobbyID: string): string {
  const endpoint = 'match_executor';
  const options = {
    lobbyID,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryLobbyMessages(lobby_id: string): string {
  const endpoint = 'lobby_moves';
  const options = {
    lobby_id,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryNftsForLobby(lobby_id: string): string {
  const endpoint = 'nfts/lobby';
  const options = {
    lobby_id,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryNftsForWallet(wallet: WalletAddress): string {
  const endpoint = 'nfts/wallet';
  const options = {
    wallet,
  };
  return buildBackendQuery(endpoint, options);
}
