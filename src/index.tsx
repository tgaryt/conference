import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { ChatProvider } from './components/ChatProvider';
import { ParticipantProvider } from './components/ParticipantProvider';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

const axios = require('axios').default;

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();
  const [roomName, setRoomName] = useState('');
  const [roomLoading, setRoomLoading] = useState(true);

  async function getRooms() {
    setRoomLoading(true);
    const url = new URL(window.location.href);
    const r = url.searchParams.get('r') || '';
    return await axios.get('https://ezadtv.com/api/v1/conferences?room=' + r);
  }

  useEffect(() => {
    getRooms()
      .then(result => {
        if (result.data.validRoom) {
          const url = new URL(window.location.href);
          const r = url.searchParams.get('r') || '';
          if (r === result.data.validRoom) {
            setRoomName(result.data.validRoom);
          } else {
            window.location.replace('/room/?r=' + result.data.validRoom);
          }
        }
      })
      .finally(() => {
        setRoomLoading(false);
      });
  }, []);

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <ParticipantProvider>
        <ChatProvider>
          <App roomName={roomName} roomLoading={roomLoading} />
        </ChatProvider>
      </ParticipantProvider>
    </VideoProvider>
  );
};

export const ReactApp = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <UnsupportedBrowserWarning>
      <Router>
        <AppStateProvider>
          <Switch>
            <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute>
            <PrivateRoute path="/room">
              <VideoApp />
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </UnsupportedBrowserWarning>
  </MuiThemeProvider>
);

ReactDOM.render(<ReactApp />, document.getElementById('root'));
