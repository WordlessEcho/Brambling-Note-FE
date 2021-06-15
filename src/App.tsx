import React, { useEffect, useState } from 'react';

import { Container, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { zhCN } from '@material-ui/core/locale';

import { User } from './types';
import noteService from './services/note';
import utils from './utils';

import ApplicationBar from './components/ApplicationBar';

type DialogStatus = { login: boolean };
const theme = createMuiTheme({}, zhCN);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>({ login: false });

  const handleLogout = () => {
    localStorage.removeItem('user');
    noteService.clearToken();
    setUser(null);
  };

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
      noteService.setToken(user.token);
      // TODO: get all notes
    } else {
      const cacheUser = localStorage.getItem('user');

      if (cacheUser !== null) {
        const parsedUser = utils.toUser(JSON.parse(cacheUser));
        setUser(parsedUser);
        noteService.setToken(parsedUser.token);
      }
      // TODO: display a user guide
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <ApplicationBar
        handleLogout={handleLogout}
        displayName={user === null ? null : user.name}
        showLogin={() => setDialogStatus({ ...dialogStatus, login: true })}
      />

      <Container component="main">
        Hello world!
      </Container>
    </ThemeProvider>
  );
};

export default App;
