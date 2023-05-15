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
import { RootState, setSelectedNFT } from '@src/redux/store';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import mw from '@game/middleware';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { rtkApi } from '@src/redux/rtkQuery/rootApi';

export function Join() {
  // const userNFTs = useSelector((state: RootState) => state.app.userNFTs);
  const selectedNFTID = useSelector((state: RootState) => state.app.selectedNFT);
  const userWallet = useSelector((state: RootState) => state.app.userWallet);
  const navigate = useNavigate();
  if (!userWallet) {
    navigate('/');
  }
  const [showDescriptionPrompt, setShowDescriptionPrompt] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const userNFTs = rtkApi.nftApi.endpoints.getNFTsForWallet.useQuery(
    userWallet ? userWallet.walletAddress : skipToken,
    { pollingInterval: 6000 }
  );

  const dispatch = useDispatch();

  const handleNFTChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedNFT(event.target.value));
  };

  const handleJoinClick = useCallback(() => {
    const selectedNFT = userNFTs.data.find(nft => nft.nft_id === selectedNFTID);
    if (!selectedNFT.nft_description || selectedNFT.nft_description.length === 0) {
      // prompt for initial description
      setShowDescriptionPrompt(true);
    } else if (selectedNFT.lobby_id === '1' && selectedNFT.nft_description.length > 0) {
      // route to lobby
      navigate('/lobby/1');
    } else {
      mw.joinNftToLobby('1', selectedNFTID, '').then(joinResult => {
        if (joinResult.success) {
          // then route to lobby
          navigate('/lobby/1');
        }
      });
      // then route to lobby
    }
  }, [navigate, selectedNFTID, userNFTs]);

  const handleDescriptionInputSubmit = useCallback(() => {
    // setDescriptionInput(event.target.value);
    // const userDescription = event.target.value;
    // TODO: dispatch join lobby action with description added here
    mw.joinNftToLobby('1', selectedNFTID, descriptionInput).then(joinResult => {
      if (joinResult.success) {
        // then route to lobby
        navigate('/lobby/1');
      }
    });
  }, [descriptionInput, navigate, selectedNFTID]);

  const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionInput(event.target.value);
  };

  const handleDescriptionPromptClose = () => {
    setShowDescriptionPrompt(false);
  };

  const userHasNFTs = !userNFTs.isLoading && !userNFTs.error && userNFTs.data?.length > 0;

  return (
    <Box>
      {userHasNFTs ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography>Select the NFT you would like to join the game with</Typography>

          <Select sx={{ width: '200px' }} value={selectedNFTID} onChange={handleNFTChange}>
            {userNFTs?.data?.map(nft => (
              <MenuItem key={`${nft.contract_address}-${nft.nft_id}`} value={nft.nft_id}>
                {nft.nft_id}
              </MenuItem>
            ))}
          </Select>

          <Button sx={{ mt: 2 }} variant="contained" onClick={handleJoinClick}>
            Join
          </Button>
          <Button onClick={() => navigate('/buy')}>Buy</Button>

          <Dialog onClose={handleDescriptionPromptClose} open={showDescriptionPrompt}>
            <DialogTitle>Enter your initial Character Description</DialogTitle>
            <DialogContent>
              {/* onChange={handleDescriptionInputChange} */}
              <Input type="text" value={descriptionInput} onChange={handleDescriptionInputChange} />
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleDescriptionPromptClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleDescriptionInputSubmit}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5">
            You don't have any Oracle NFTs yet. Go buy one to play!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/buy')}>
            Buy My Character!
          </Button>
        </Box>
      )}
    </Box>
  );
}
