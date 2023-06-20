import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@src/redux/store';
import mw from '@game/middleware';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import {
  Box,
  ButtonBase,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { NFT_CDE } from '@game/utils';
import { ImageOutlined, Send } from '@mui/icons-material';
import TitleImage from '@assets/title.png';

const avatarSize = '120px';

export function Lobby(): React.JSX.Element {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const joinedLobby = useSelector((state: RootState) => state.app.joinedLobby);
  const displayedLobby = joinedLobby ?? '1';
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const { data: lobbyNfts } = rtkApi.lobby.endpoints.getNFTsForLobby.useQuery(displayedLobby, {
    pollingInterval: 5_000,
  });

  const { data: lobbyMessages } = rtkApi.lobby.endpoints.getMessagesForLobby.useQuery(
    displayedLobby,
    {
      pollingInterval: 5_000,
    }
  );
  const joinedNFT = useSelector((state: RootState) => state.app.selectedNft);
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

    setCloseupNft(joinedNFT);
  }, [closeupNft, joinedNFT]);

  const descriptions = useMemo(() => lobbyNfts?.map(nft => nft.nft_description), [lobbyNfts]);
  const { data: images } = rtkApi.lobby.endpoints.getImages.useQuery(descriptions ?? skipToken);
  useEffect(() => {
    if (descriptions == null) return;
    dispatch(rtkApi.lobby.endpoints.fetchImages.initiate(descriptions));
  }, [descriptions, dispatch]);

  if (
    lobbyNfts == null ||
    lobbyMessages == null ||
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
      display="flex"
      gap={theme.spacing(2)}
      alignItems="start"
      position="relative"
      // TODO: there has to be a better way
      // removes intrinsic height
      minHeight={0}
      width="100%"
    >
      <Box
        style={{
          flex: '224',
          backgroundColor: '#000000a6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '8px',
          padding: `${theme.spacing(3)} ${theme.spacing(1.5)}`,
        }}
      >
        <img width="203.25px" height="18px" alt="oracle-rpg" src={TitleImage} />
        <Box minHeight={theme.spacing(2)} />
        <Typography variant="caption">
          Welcome, brave adventurer, to the fantastical realms of Oracle RPG, where epic quests,
          mythical creatures, and boundless magic await your triumphant arrival!
        </Typography>
        <Box minHeight={theme.spacing(1.5)} />
        <Box
          sx={{
            aspectRatio: 1,
            width: '100%',
          }}
        >
          {closeupNftImage != null && (
            <img
              style={{
                aspectRatio: 1,
                width: '100%',
                borderRadius: '10px',
                border: '3px solid #ffffff20',
              }}
              alt={`selected player - ${closeupNft}`}
              src={`data:image/jpeg;base64,${closeupNftImage}`}
            />
          )}
          {closeupNftImage == null && (
            <ImageOutlined
              sx={{
                height: '100%',
                width: '100%',
              }}
            />
          )}
        </Box>
        <Box minHeight={theme.spacing(2.5)} />
        <Select
          fullWidth
          value={closeupNft ?? ''}
          onChange={event =>
            setCloseupNft(event.target.value === '' ? undefined : event.target.value)
          }
        >
          {lobbyNfts.map(nft => (
            <MenuItem key={nft.nft_id} value={nft.nft_id}>
              {nft.nft_id}
            </MenuItem>
          ))}
        </Select>
        <Box minHeight={theme.spacing(1.5)} />
        <Typography variant="caption">{closeupNftDescription}</Typography>
      </Box>
      <Box
        style={{
          width: '100%',
          height: '100%',
          flex: '824',
          backgroundColor: '#000000a6',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            flex: 'auto',
            // TODO: there has to be a better way
            // removes intrinsic height
            minHeight: 0,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            padding: theme.spacing(3),
          }}
        >
          <Box
            sx={{
              flex: 'auto',
              overflow: 'auto',
              '::-webkit-scrollbar': {
                width: '8px',
              },
              '::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: '#5f5b50',
                borderRadius: '4px',
              },
              // stick out scrollbar into margin
              marginRight: `-${theme.spacing(2)}`,
              paddingRight: theme.spacing(2),
              // removes intrinsic height
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: theme.spacing(3),
            }}
          >
            {lobbyMessages.map(lobbyMove => {
              const description = nftMap[lobbyMove.nft_id]?.nft_description;
              const image = images[description];
              const isMe = joinedNFT != null && lobbyMove.nft_id === joinedNFT;
              return (
                <ButtonBase
                  key={lobbyMove.id}
                  onClick={() => {
                    setCloseupNft(lobbyMove.nft_id);
                  }}
                  sx={{
                    width: 'fit-content',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'end' : 'start',
                    alignSelf: isMe ? 'end' : 'start',
                  }}
                >
                  <Typography variant="sender">
                    {lobbyMove.is_oracle ? 'THE ORACLE' : isMe ? 'ME' : lobbyMove.nft_id}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: lobbyMove.nft_id === joinedNFT ? '#816e3d' : '#636157',
                      textAlign: isMe ? 'right' : 'left',
                      borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0px',
                      padding: theme.spacing(1),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: theme.spacing(1),
                    }}
                  >
                    <Box
                      sx={{
                        width: avatarSize,
                        height: avatarSize,
                        clear: 'both',
                        marginLeft: isMe ? 'auto' : 'unset',
                        display: lobbyMove.is_oracle ? 'none' : 'block',
                      }}
                    >
                      {image != null && (
                        <img
                          style={{
                            borderRadius: '4px',
                          }}
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
                    <Typography variant="body1">{lobbyMove.move_entry}</Typography>
                  </Box>
                </ButtonBase>
              );
            })}
          </Box>
          <TextField
            value={message}
            disabled={joinedLobby == null || userWallet == null}
            onChange={event => setMessage(event.target.value.slice(0, 500))}
            multiline
            placeholder="Send a message"
            sx={{
              // bgcolor: 'white',
              borderRadius: '8px',
              fontSize: '1rem',
              lineHeight: '1.125rem',
            }}
            InputProps={{
              sx: {
                padding: theme.spacing(0.5),
              },
              endAdornment: (
                <Box
                  sx={{
                    borderRadius: '4px',
                    bgcolor: '#ababab',
                  }}
                >
                  <IconButton
                    sx={{
                      color: 'white',
                    }}
                    onClick={async () => {
                      await mw.submitMoves({
                        lobbyId: joinedLobby,
                        nftId: joinedNFT,
                        moveEntry: message,
                        cdeName: NFT_CDE,
                        wallet: userWallet.walletAddress,
                      });
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
