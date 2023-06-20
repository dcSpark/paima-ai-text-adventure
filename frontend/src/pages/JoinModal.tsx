import {
  Box,
  Button,
  Dialog,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  RootState,
  setBuyModal,
  setJoinedLobby,
  setSelectedNft,
  store,
  useAppDispatch,
} from '@src/redux/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import mw from '@game/middleware';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import { NFT_CDE } from '@game/utils';

export function JoinModal() {
  const theme = useTheme();
  const dispatch: typeof store['dispatch'] = useAppDispatch();
  const selectedNftId = useSelector((state: RootState) => state.app.selectedNft);
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const joinedLobby = useSelector((state: RootState) => state.app.joinedLobby);
  const [selectedLobby, setSelectedLobby] = useState('');

  const [showDescriptionPrompt, setShowDescriptionPrompt] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const { data: userNFTs } = rtkApi.nft.endpoints.getNFTsForWallet.useQuery(
    userWallet ? userWallet.walletAddress : skipToken,
    { pollingInterval: 5_000 }
  );
  const open = joinedLobby == null && userNFTs != null && userNFTs.length !== 0;

  const selectedNft =
    userNFTs == null ? undefined : userNFTs.find(nft => nft.nft_id === selectedNftId);
  const lobbyToJoin = selectedNft?.lobby_id ?? selectedLobby ?? undefined;

  const { data: userLobbies } = rtkApi.lobby.endpoints.getLobbies.useQuery(undefined, {
    pollingInterval: 10_000,
  });

  useEffect(() => {
    // assert: an nft is selected after load
    if (userNFTs != null && selectedNftId == null && userNFTs.length > 0) {
      dispatch(setSelectedNft(userNFTs[userNFTs.length - 1].nft_id));
    }
  });

  const handleJoin = useCallback(async () => {
    if (userNFTs == null) return;

    const selectedNFT = userNFTs.find(nft => nft.nft_id === selectedNftId);
    if (selectedNFT == null) return;

    if (selectedNFT.lobby_id != null && selectedNFT.nft_description.length > 0) {
      // go to previously joined lobby
      dispatch(setJoinedLobby(selectedNFT.lobby_id));
      return;
    }

    if (!selectedNFT.nft_description || selectedNFT.nft_description.length === 0) {
      // prompt for initial description
      setShowDescriptionPrompt(true);
      return;
    }
  }, [dispatch, selectedNftId, userNFTs]);

  const handleSubmitDescription = useCallback(async () => {
    const joinResult = await mw.joinNftToLobby({
      lobbyId: lobbyToJoin,
      nftId: selectedNftId,
      initialDescription: descriptionInput,
      cdeName: NFT_CDE,
    });
    if (joinResult.success) {
      dispatch(setJoinedLobby(lobbyToJoin));
    }
  }, [descriptionInput, dispatch, lobbyToJoin, selectedNftId]);

  const createLobby = async () => {
    await mw.createLobby(selectedNftId);
  };

  console.log('HELLO lobbies', userLobbies);

  if (userNFTs == null || userNFTs.length === 0 || userLobbies == null) return <Box />;

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          border: 'none',
          borderRadius: '4px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(3),
          bgcolor: '#282828',
          border: '12px solid #ffffff33',
          color: 'white',
        }}
      >
        <Typography variant="h2">
          <span style={{ fontWeight: 700 }}>Select an NFT</span> to join the game with
        </Typography>
        <Box minHeight={theme.spacing(2.5)} />
        <Select
          sx={{ width: '200px' }}
          value={selectedNftId ?? ''}
          onChange={event => {
            dispatch(setSelectedNft(event.target.value));
          }}
        >
          {userNFTs.map(nft => (
            <MenuItem key={`${nft.contract_address}-${nft.nft_id}`} value={nft.nft_id}>
              {nft.nft_id}
            </MenuItem>
          ))}
        </Select>
        <Box minHeight={theme.spacing(2)} />
        <Button fullWidth variant="contained" onClick={handleJoin} disabled={lobbyToJoin == null}>
          Join
        </Button>
        <Box minHeight={theme.spacing(1)} />
        <Button fullWidth onClick={() => dispatch(setBuyModal(true))}>
          Buy
        </Button>
        <Box minHeight={theme.spacing(2)} />
        <Select
          disabled={selectedNft?.lobby_id != null}
          sx={{
            width: '200px',
          }}
          value={selectedLobby || lobbyToJoin || ''}
          onChange={event => {
            setSelectedLobby(event.target.value);
          }}
        >
          {userLobbies.map(lobby => (
            <MenuItem key={lobby.id} value={lobby.id}>
              {lobby.id}
            </MenuItem>
          ))}
        </Select>
        <Box minHeight={theme.spacing(1)} />
        <Button disabled={selectedNft?.lobby_id != null} fullWidth onClick={createLobby}>
          Create New Lobby
        </Button>
        <Dialog
          open={showDescriptionPrompt}
          PaperProps={{
            sx: {
              border: 'none',
              borderRadius: '4px',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: theme.spacing(3),
              bgcolor: '#282828',
              border: '12px solid #ffffff33',
              color: 'white',
            }}
          >
            <Typography variant="h2">
              <span style={{ fontWeight: 700 }}>Define Your Destiny</span> with a Character
              Description in Oracle RPG!
            </Typography>
            <Box minHeight={theme.spacing(2.5)} />
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={descriptionInput}
              onChange={event => {
                setDescriptionInput(event.target.value?.slice(0, 200));
              }}
            />
            <Box minHeight={theme.spacing(2)} />
            <Button variant="contained" onClick={handleSubmitDescription}>
              Submit
            </Button>
            <Button
              variant="text"
              sx={{
                bgcolor: 'transparent',
                color: 'white',
              }}
              onClick={() => {
                setShowDescriptionPrompt(false);
              }}
            >
              Cancel
            </Button>
            <Box minHeight={theme.spacing(1)} />
          </Box>
        </Dialog>
      </Box>
    </Dialog>
  );
}
