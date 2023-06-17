import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@src/redux/store';
import mw from '@game/middleware';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  MessageGroup,
  Sidebar,
} from '@chatscope/chat-ui-kit-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { NFT_CDE } from '@game/utils';
import { ImageOutlined } from '@mui/icons-material';

const avatarSize = '128px';
const selectedAvatarSize = '256px';

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

  const [closeupNft, setCloseupNft] = useState<string>();
  useEffect(() => {
    // auto-select user's nft on load
    if (closeupNft != null) return;

    setCloseupNft(selectedNFT);
  }, [closeupNft, selectedNFT]);

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

  const closeupNftDescription = nftMap[closeupNft]?.nft_description;
  const closeupNftImage = images[closeupNftDescription];

  return (
    <Box
      flex="auto"
      // overflow="auto"
      minHeight={0} // important: removes intrinsic height
      width="100%"
    >
      <MainContainer
        responsive
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(2),
        }}
      >
        <Sidebar
          position="left"
          style={{
            flex: 'none',
            padding: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              width: selectedAvatarSize,
              height: selectedAvatarSize,
            }}
          >
            {closeupNftImage != null && (
              <img
                width={selectedAvatarSize}
                height={selectedAvatarSize}
                alt={`selected player - ${closeupNft}`}
                src={`data:image/jpeg;base64,${closeupNftImage}`}
              />
            )}
            {closeupNftImage == null && (
              <ImageOutlined
                sx={{
                  width: selectedAvatarSize,
                  height: selectedAvatarSize,
                }}
              />
            )}
            <Typography variant="caption">{closeupNftDescription}</Typography>
          </Box>
        </Sidebar>
        <ChatContainer
          style={{
            width: '100%',
            height: '100%',
            flex: 'auto',
            backgroundColor: 'indigo',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MessageList
            style={{
              flex: 'auto',
              overflow: 'auto',
              minHeight: 0, // important: removes intrinsic height
              display: 'flex',
              flexDirection: 'column-reverse',
              padding: theme.spacing(2),
            }}
          >
            {reversedMessages.map((lobbyMove, index) => {
              const description = nftMap[lobbyMove.nft_id]?.nft_description;
              const image = images[description];
              return (
                <MessageGroup.Messages>
                  <ButtonBase
                    onClick={() => {
                      setCloseupNft(lobbyMove.nft_id);
                    }}
                    sx={{
                      width: 'fit-content',
                      maxWidth: '80%',
                      display: 'block',
                      marginLeft: lobbyMove.wallet === userWallet.walletAddress ? 'auto' : 'unset',
                    }}
                  >
                    <Message
                      key={lobbyMove.id}
                      style={{
                        color: 'white',
                        backgroundColor:
                          lobbyMove.wallet === userWallet.walletAddress
                            ? 'green'
                            : lobbyMove.is_oracle
                            ? 'orange'
                            : 'blue',
                        textAlign: lobbyMove.wallet === userWallet.walletAddress ? 'right' : 'left',
                        padding: theme.spacing(1),
                        borderRadius: theme.spacing(2),
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
                        sender={lobbyMove.is_oracle ? 'The Oracle' : undefined}
                        style={{
                          fontSize: '2rem',
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
                            position: 'relative',
                          }}
                        >
                          {image != null && (
                            <>
                              <img
                                width={avatarSize}
                                height={avatarSize}
                                alt={`player ${lobbyMove.nft_id}`}
                                src={`data:image/jpeg;base64,${image}`}
                              />
                              <Typography
                                variant="caption"
                                fontSize="2.5rem"
                                position="absolute"
                                right={theme.spacing(1)}
                                bottom={theme.spacing(1)}
                              >
                                {lobbyMove.nft_id}
                              </Typography>
                            </>
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
                  </ButtonBase>
                </MessageGroup.Messages>
              );
            })}
          </MessageList>
          <MessageInput
            attachDisabled
            attachButton={false}
            style={{ backgroundColor: 'red', color: 'white', bottom: '0px', maxWidth: '100%' }}
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
