import React from 'react';
import { useParams } from 'react-router-dom';
import { MainChat } from '../components/Chat';
import { LobbyMoves, LobbyNFTs } from '@game/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
// import mw from '@game/middleware';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';

export function Lobby(): React.JSX.Element {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  // const [lobbyMessages, setLobbyMessages] = React.useState<LobbyMoves>([]);
  // Use the lobbyId variable in your component
  // ...
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  // const lobbyNFTs = useSelector((state: RootState) => state.app.lobbyNFTs);
  const lobbyNFTsResult = rtkApi.nftApi.endpoints.getNFTsForLobby.useQuery(lobbyId, {
    pollingInterval: 4000,
  });
  const lobbyMessages = rtkApi.nftApi.endpoints.getMessagesForLobby.useQuery(lobbyId, {
    pollingInterval: 4000,
  });
  // const selectedNFTID = useSelector((state: RootState) => state.app.selectedNFT);
  if (lobbyNFTsResult.isLoading || lobbyMessages.isLoading) {
    return null;
  }
  return (
    <MainChat
      messages={lobbyMessages.data as LobbyMoves}
      connectedUser={userWallet?.walletAddress || '0x0'}
      nftColorMapping={
        (lobbyNFTsResult?.data as LobbyNFTs).reduce((acc, nft) => {
          acc[nft.nft_id] = nft.nft_description;
          return acc;
        }, {} as Record<string, string>) ?? {}
      }
      sendCallback={async (message: string) => {
        // const result = await mw.submitMoves(message, lobbyId, selectedNFTID);
        // setTimeout(async () => {
        //   const oracleState = await mw.getLobbyMoves(lobbyId);
        //   if (oracleState.success) {
        //     setLobbyMessages(oracleState.messages);
        //   }
        //   mw.getNftsForLobby(lobbyId).then(nftResponse => {
        //     if (nftResponse.success) {
        //       dispatch(setLobbyNFTs(nftResponse.nfts));
        //     }
        //   });
        // }, 6_000);
      }}
    />
  );
}
