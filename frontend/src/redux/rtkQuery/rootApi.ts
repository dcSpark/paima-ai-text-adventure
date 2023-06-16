import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { lobbyApi } from './lobbyApi';
import { nftApi } from './nftApi';
import type { ValuesType } from 'utility-types';
import { Tags } from './rtkTags';

export type CustomBuilder = EndpointBuilder<any, ValuesType<typeof Tags>, any>;

export const rtkApi = {
  nft: nftApi,
  lobby: lobbyApi,
};
