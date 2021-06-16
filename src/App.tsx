import React, { useEffect, useState } from 'react';

import {
  Container, ThemeProvider, Theme, createStyles, makeStyles, createMuiTheme,
} from '@material-ui/core';
import { zhCN } from '@material-ui/core/locale';

import {
  LoginUser, NewNote, Note, User,
} from './types';
import loginService from './services/login';
import noteService from './services/note';
import utils from './utils';

import ApplicationBar from './components/ApplicationBar';
import Login from './components/Login';
import Notes from './components/Notes';

type DialogStatus = { login: boolean };
const theme = createMuiTheme({}, zhCN);
const useStyles = makeStyles((t: Theme) => createStyles(
  { appBarSpacer: t.mixins.toolbar },
));

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>({ login: false });
  const classes = useStyles();

  const handleLogin = (loginUser: LoginUser) => (
    loginService.login(loginUser)
      .then((u) => setUser(u))
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    noteService.clearToken();
    setUser(null);
  };

  const handleNoteUpdate = (id: string, newNote: NewNote) => (
    noteService.update(id, newNote)
      .then((returnedNote) => setNotes(
        notes.map((note) => (note.id === id ? returnedNote : note)),
      ))
  );

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
      noteService.setToken(user.token);
      noteService.getAll().then((n) => setNotes(n));
    } else {
      const cacheUser = localStorage.getItem('user');

      if (cacheUser !== null) {
        const parsedUser = utils.toUser(JSON.parse(cacheUser));
        setUser(parsedUser);
        noteService.setToken(parsedUser.token);
        noteService.getAll().then((n) => setNotes(n));
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

      <Login
        display={dialogStatus.login}
        hideDialog={() => setDialogStatus({ ...dialogStatus, login: false })}
        login={handleLogin}
      />

      <div className={classes.appBarSpacer} />
      <Container component="main">
        <Notes
          notes={notes}
          setNotes={setNotes}
          updateNote={handleNoteUpdate}
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
