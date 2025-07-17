import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import ChatInput from './ChatInput/ChatInput';
import clsx from 'clsx';
import MessageList from './MessageList/MessageList';
import Snackbar from '../Snackbar/Snackbar';
import useChatContext from '../../hooks/useChatContext/useChatContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      background: '#FFFFFF',
      zIndex: 9,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #E4E7E9',
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      },
    },
    hide: {
      display: 'none',
    },
  })
);

// In this component, we are toggling the visibility of the ChatWindow with CSS instead of
// conditionally rendering the component in the DOM. This is done so that the ChatWindow is
// not unmounted while a file upload is in progress.

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen, messages, conversation } = useChatContext();
  const [messageUrl, setMessageUrl] = useState<string | React.ReactNode | null>(null);
  const [messagesLength, setMessagesLength] = useState<number>(0);

  useEffect(() => {
    if (messagesLength > 0 && messages.length > messagesLength) {
      const newMessage = messages[messages.length - 1];
      const urlRegex = /(((https?:\/\/)|(www\.))\S+)/g;
      if (newMessage) {
        if (newMessage.type === 'text') {
          const urls = newMessage.body.match(urlRegex);
          if (urls && urls.length > 0) {
            setMessageUrl(
              urls.map(url => (
                <div style={{ wordBreak: 'break-all' }}>
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </Link>{' '}
                  <br />
                </div>
              ))
            );
          }
        } else if (newMessage.type === 'media') {
          console.log('new media message', newMessage.media); // await getContentTemporaryUrl, use that?
        }
      }
    }
    setMessagesLength(messages.length);
  }, [messages]);

  return (
    <>
      <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen })}>
        <ChatWindowHeader />
        <MessageList messages={messages} />
        <ChatInput conversation={conversation!} isChatWindowOpen={isChatWindowOpen} />
      </aside>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(messageUrl)}
        headline="Goto URL"
        message={messageUrl || ''}
        variant="info"
        handleClose={() => setMessageUrl(null)}
        bottomMargin="1"
      />
    </>
  );
}
