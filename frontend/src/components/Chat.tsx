import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import React from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import { LobbyMoves } from '@game/utils';
import { Box } from '@mui/material';

export function MainChat(props: {
  sendCallback: (message: string) => void;
  messages: LobbyMoves;
  connectedUser: string;
  nftColorMapping?: Record<string, string>;
}) {
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <MainContainer
        style={{
          backgroundColor: 'indigo',
          maxWidth: '800px',
          width: '100vw',
        }}
      >
        <ChatContainer>
          <MessageList>
            {[...props.messages].reverse().map((lobbyMove, index) => (
              <Message
                key={lobbyMove.id}
                style={{
                  color: 'white',
                  maxWidth: '250px',
                  backgroundColor:
                    lobbyMove.wallet === props.connectedUser
                      ? 'green'
                      : lobbyMove.is_oracle
                      ? 'orange'
                      : 'blue',
                  marginLeft: lobbyMove.wallet === props.connectedUser ? 'auto' : 'unset',
                  padding: '4px',
                  borderRadius: '10px',
                  marginTop: index === 0 ? 'unset' : '10px',
                }}
                model={{
                  message: lobbyMove.move_entry,
                  sender: lobbyMove.wallet,
                  position: 'normal',
                  direction: lobbyMove.wallet === props.connectedUser ? 'outgoing' : 'incoming',
                }}
              >
                <Message.Header
                  sender={lobbyMove.is_oracle ? 'The Oracle' : `${lobbyMove.wallet}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    color: 'white',
                    width: '100%',
                    clear: 'both',
                    justifyContent: lobbyMove.wallet === props.connectedUser ? 'end' : 'unset',
                  }}
                />
                <Avatar>
                  <Box
                    sx={{
                      width: '64px',
                      height: '64px',
                      clear: 'both',
                      marginLeft: lobbyMove.wallet === props.connectedUser ? 'auto' : 'unset',
                      display: lobbyMove.is_oracle ? 'none' : 'block',
                      backgroundColor:
                        props.nftColorMapping && props.nftColorMapping[lobbyMove.nft_id]
                          ? props.nftColorMapping[lobbyMove.nft_id]
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
            onSend={message => {
              props.sendCallback(message);
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
