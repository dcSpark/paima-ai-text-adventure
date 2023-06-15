import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { RootState, setJoinedLobby, setSelectedNft } from '@src/redux/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import mw from '@game/middleware';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';
import { ROUTES } from '@src/routes';

const lobbyToJoin = '1'; // TODO magic constant

export function Join() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedNftId = useSelector((state: RootState) => state.app.selectedNft);
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const [showDescriptionPrompt, setShowDescriptionPrompt] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const { data: userNFTs } = rtkApi.nft.endpoints.getNFTsForWallet.useQuery(
    userWallet ? userWallet.walletAddress : skipToken,
    { pollingInterval: 5_000 }
  );

  useEffect(() => {
    // assert: an nft is selected after load
    if (userNFTs == null) return;

    if (selectedNftId == null && userNFTs.length > 0) {
      dispatch(setSelectedNft(userNFTs[0].nft_id));
    }
  });

  useEffect(() => {
    // assert: user owns nft after load
    if (userNFTs == null) return;

    if (userNFTs.length === 0) {
      navigate(ROUTES.NO_NFT);
    }
  });

  const handleJoin = useCallback(async () => {
    if (userNFTs == null) return;

    const selectedNFT = userNFTs.find(nft => nft.nft_id === selectedNftId);
    if (selectedNFT == null) return;

    if (selectedNFT.lobby_id != null && selectedNFT.nft_description.length > 0) {
      // go to previously joined lobby
      dispatch(setJoinedLobby(selectedNFT.lobby_id));
      navigate(ROUTES.LOBBY);
      return;
    }

    if (!selectedNFT.nft_description || selectedNFT.nft_description.length === 0) {
      // prompt for initial description
      setShowDescriptionPrompt(true);
      return;
    }

    // TODO: can this happen? seems like this is done through the description modal
    // join lobby
    const joinResult = await mw.joinNftToLobby(lobbyToJoin, selectedNftId, descriptionInput);
    if (joinResult.success) {
      dispatch(setJoinedLobby(lobbyToJoin));
      navigate(ROUTES.LOBBY);
    }
  }, [descriptionInput, dispatch, navigate, selectedNftId, userNFTs]);

  const handleSubmitDescription = useCallback(async () => {
    const joinResult = await mw.joinNftToLobby(lobbyToJoin, selectedNftId, descriptionInput);
    if (joinResult.success) {
      dispatch(setJoinedLobby(lobbyToJoin));
      navigate(ROUTES.LOBBY);
    }
  }, [descriptionInput, dispatch, navigate, selectedNftId]);

  if (userNFTs == null || userNFTs.length === 0) return <Box />;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography>Select an NFT to join the game with</Typography>
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
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleJoin}>
          Join
        </Button>
        <Button onClick={() => navigate(ROUTES.BUY)}>Buy</Button>
        <Dialog
          onClose={() => {
            setShowDescriptionPrompt(false);
          }}
          open={showDescriptionPrompt}
        >
          <DialogTitle>Enter your initial Character Description</DialogTitle>
          <DialogContent>
            <Input
              type="text"
              value={descriptionInput}
              onChange={event => {
                setDescriptionInput(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={() => {
                setShowDescriptionPrompt(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmitDescription}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
