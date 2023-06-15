import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import mw from '@game/middleware';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import { Box, useTheme } from '@mui/material';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import { truncateAddress } from '@src/services/utils';

export function Lobby(): React.JSX.Element {
  const theme = useTheme();
  const lobbyId = useSelector((state: RootState) => state.app.joinedLobby);
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const { data: lobbyNfts } = rtkApi.lobby.endpoints.getNFTsForLobby.useQuery(lobbyId, {
    pollingInterval: 5_000,
  });
  const { data: lobbyMessages } = rtkApi.lobby.endpoints.getMessagesForLobby.useQuery(lobbyId, {
    pollingInterval: 5_000,
  });
  const selectedNFT = useSelector((state: RootState) => state.app.selectedNft);
  const nftColorMap = useMemo(() => {
    if (lobbyNfts == null) return undefined;
    return Object.fromEntries(lobbyNfts.map(nft => [nft.nft_id, nft.nft_description]));
  }, [lobbyNfts]);
  const reversedMessages = useMemo(() => {
    if (lobbyMessages == null) return undefined;
    return [...lobbyMessages].reverse();
  }, [lobbyMessages]);

  if (
    lobbyNfts == null ||
    lobbyMessages == null ||
    userWallet == null ||
    nftColorMap == null ||
    reversedMessages == null
  ) {
    return <Box />;
  }

  return (
    <Box position="relative">
      <MainContainer
        style={{
          backgroundColor: 'indigo',
          maxWidth: `${theme.breakpoints.values.md}px`,
          width: '100vw',
        }}
      >
        <ChatContainer>
          <MessageList>
            {reversedMessages.map((lobbyMove, index) => (
              <Message
                key={lobbyMove.id}
                style={{
                  color: 'white',
                  maxWidth: '250px',
                  backgroundColor:
                    lobbyMove.wallet === userWallet.walletAddress
                      ? 'green'
                      : lobbyMove.is_oracle
                      ? 'orange'
                      : 'blue',
                  marginLeft: lobbyMove.wallet === userWallet.walletAddress ? 'auto' : 'unset',
                  padding: '4px',
                  borderRadius: '10px',
                  marginTop: index === 0 ? 'unset' : '10px',
                }}
                model={{
                  message: lobbyMove.move_entry,
                  sender: lobbyMove.wallet,
                  position: 'normal',
                  direction:
                    lobbyMove.wallet === userWallet.walletAddress ? 'outgoing' : 'incoming',
                }}
              >
                <Message.Header
                  sender={
                    lobbyMove.is_oracle ? 'The Oracle' : `${truncateAddress(lobbyMove.wallet)}`
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    color: 'white',
                    width: '100%',
                    clear: 'both',
                    justifyContent: lobbyMove.wallet === userWallet.walletAddress ? 'end' : 'unset',
                  }}
                />
                <Avatar>
                  <Box
                    sx={{
                      width: '64px',
                      height: '64px',
                      clear: 'both',
                      marginLeft: lobbyMove.wallet === userWallet.walletAddress ? 'auto' : 'unset',
                      display: lobbyMove.is_oracle ? 'none' : 'block',
                      backgroundColor:
                        nftColorMap && nftColorMap[lobbyMove.nft_id]
                          ? nftColorMap[lobbyMove.nft_id]
                          : 'green',
                    }}
                  >{`NFT ${lobbyMove.nft_id}`}</Box>
                </Avatar>
              </Message>
            ))}
          </MessageList>
          <MessageInput
            attachDisabled
            attachButton={false}
            style={{ backgroundColor: 'red', color: 'white', bottom: '0px' }}
            placeholder="Type message here"
            onSend={async message => {
              await mw.submitMoves(message, lobbyId, selectedNFT);
            }}
          />
        </ChatContainer>
      </MainContainer>
    </Box>
  );
}
