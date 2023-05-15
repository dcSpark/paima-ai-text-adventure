import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    setMessages([...messages, inputValue]);
    setInputValue('');
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100vh" p={2}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        height="80vh"
        overflow="auto"
        mb={2}
        border={1}
      >
        {messages.map((message, index) => (
          <Typography key={index} variant="body1" gutterBottom>
            {message}
          </Typography>
        ))}
      </Box>
      <Box
        component="form"
        display="flex"
        justifyContent="space-between"
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <TextField
          fullWidth
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          variant="outlined"
          placeholder="Type a message..."
        />
        <Button color="primary" variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
