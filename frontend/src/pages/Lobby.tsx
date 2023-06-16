import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@src/redux/store';
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
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { NFT_CDE } from '@game/utils';
import { ImageOutlined } from '@mui/icons-material';

const avatarSize = '64px';

export function Lobby(): React.JSX.Element {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const lobbyId = useSelector((state: RootState) => state.app.joinedLobby);
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const { data: lobbyNfts } = rtkApi.lobby.endpoints.getNFTsForLobby.useQuery(lobbyId, {
    pollingInterval: 5_000,
  });

  const { data: lobbyMessages } = rtkApi.lobby.endpoints.getMessagesForLobby.useQuery(lobbyId, {
    pollingInterval: 5_000,
  });
  const selectedNFT = useSelector((state: RootState) => state.app.selectedNft);
  const nftMap = useMemo(() => {
    if (lobbyNfts == null) return undefined;
    return Object.fromEntries(lobbyNfts.map(nft => [nft.nft_id, nft]));
  }, [lobbyNfts]);
  const reversedMessages = useMemo(() => {
    if (lobbyMessages == null) return undefined;
    return [...lobbyMessages].reverse();
  }, [lobbyMessages]);

  const descriptions = useMemo(() => lobbyNfts?.map(nft => nft.nft_description), [lobbyNfts]);
  const { data: images } = rtkApi.lobby.endpoints.getImages.useQuery(descriptions ?? skipToken);
  useEffect(() => {
    if (descriptions == null) return;
    dispatch(rtkApi.lobby.endpoints.fetchImages.initiate(descriptions));
  }, [descriptions, dispatch]);

  if (
    lobbyNfts == null ||
    lobbyMessages == null ||
    userWallet == null ||
    nftMap == null ||
    reversedMessages == null ||
    images == null
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
            {reversedMessages.map((lobbyMove, index) => {
              const description = nftMap[lobbyMove.nft_id]?.nft_description;
              const image = images[description];
              return (
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
                      justifyContent:
                        lobbyMove.wallet === userWallet.walletAddress ? 'end' : 'unset',
                    }}
                  />
                  <Avatar>
                    <Box
                      sx={{
                        width: avatarSize,
                        height: avatarSize,
                        clear: 'both',
                        marginLeft:
                          lobbyMove.wallet === userWallet.walletAddress ? 'auto' : 'unset',
                        display: lobbyMove.is_oracle ? 'none' : 'block',
                      }}
                    >
                      {image != null && (
                        <img
                          width={avatarSize}
                          height={avatarSize}
                          alt={`player ${lobbyMove.nft_id}`}
                          src={`data:image/jpeg;base64,${image}`}
                        />
                      )}

                      {image == null && (
                        <ImageOutlined
                          sx={{
                            width: avatarSize,
                            height: avatarSize,
                          }}
                        />
                      )}
                    </Box>
                  </Avatar>
                </Message>
              );
            })}
          </MessageList>
          <MessageInput
            attachDisabled
            attachButton={false}
            style={{ backgroundColor: 'red', color: 'white', bottom: '0px' }}
            placeholder="Type message here"
            onSend={async message => {
              await mw.submitMoves({
                lobbyId,
                nftId: selectedNFT,
                moveEntry: message,
                cdeName: NFT_CDE,
                wallet: userWallet.walletAddress,
              });
            }}
          />
        </ChatContainer>
      </MainContainer>
    </Box>
  );
}
