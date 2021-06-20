import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, ThemeProvider, Theme, createStyles, makeStyles, createMuiTheme,
} from '@material-ui/core';
import { zhCN } from '@material-ui/core/locale';

import {
  ErrorMessage, LoginUser, NewNote, Note, User,
} from './types';
import loginService from './services/login';
import noteService from './services/note';
import { toErrorMessage, toUser } from './utils';

import ApplicationBar from './components/ApplicationBar';
import Login from './components/Login';
import ErrorDialog from './components/ErrorDialog';
import NoteForm from './components/NoteForm';
import Notes from './components/Notes';
import NotificationSnackbar from './components/NotificationSnackbar';
import NewFab from './components/NewFab';

const theme = createMuiTheme({}, zhCN);
const useStyles = makeStyles((t: Theme) => createStyles({
  appBarSpacer: t.mixins.toolbar,
  fabSpacer: {
    height: t.spacing(11),
  },
}));

type SnackbarOnClose = (e?: React.SyntheticEvent, reason?: string) => any;
const UNDO_TIMEOUT = 5000;

const App = () => {
  const classes = useStyles();

  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [snackbarAction, setSnackbarAction] = useState<SnackbarOnClose | null>(null);

  const handleLogin = (loginUser: LoginUser) => (
    loginService.login(loginUser)
      .then((u) => setUser(u))
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    noteService.clearToken();
    setUser(null);
  };

  const handleNoteCreate = (newNote: NewNote) => (
    noteService.add(newNote)
      .then((returnedNote) => setNotes(notes.concat(returnedNote)))
  );

  const handleNoteUpdate = (id: string, newNote: NewNote) => (
    noteService.update(id, newNote)
      .then((returnedNote) => setNotes(
        notes.map((note) => (note.id === id ? returnedNote : note)),
      ))
  );

  const resetSnackbar = (undo: boolean) => {
    if (undo && noteToDelete !== null) {
      setNotes(notes.concat(noteToDelete));
    } else if (undo) {
      setErrorMessage({ title: '您要删除的便签已不存在', content: null });
    }

    setSnackbarAction(null);
    setMessage(null);
    setNoteToDelete(null);
  };

  const getRemoverForSnackbar = (id: string) => (_e?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    noteService.remove(id)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 404) {
            return setErrorMessage({ title: '您要删除的便签已不存在', content: null });
          }
        }
        const friendlyLog = toErrorMessage(error);
        return setErrorMessage(friendlyLog);
      })
      .finally(() => resetSnackbar(false));
  };

  const handleNoteDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);

    if (note === null || note === undefined) {
      setErrorMessage({ title: '您要删除的便签已不存在', content: null });
    } else {
      setNoteToDelete(note);
      setMessage(`便签「${note.content}」已被删除`);
      setNotes(notes.filter((n) => n.id !== id));

      const action = () => getRemoverForSnackbar(note.id);
      setSnackbarAction(action);
    }
  };

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
      noteService.setToken(user.token);
      noteService.getAll().then((n) => setNotes(n));
    } else {
      const cacheUser = localStorage.getItem('user');

      if (cacheUser !== null) {
        const parsedUser = toUser(JSON.parse(cacheUser));
        setUser(parsedUser);
        noteService.setToken(parsedUser.token);
        noteService.getAll().then((n) => setNotes(n));
      } else {
        setNotes([]);
      }
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <ApplicationBar
        handleLogout={handleLogout}
        displayName={user === null ? null : user.name}
        showLogin={() => setShowLogin(true)}
      />

      <Login
        display={showLogin}
        hideDialog={() => setShowLogin(false)}
        login={handleLogin}
        setErrorMessage={setErrorMessage}
      />

      {/* TODO: abstract to show more type of message */}
      <ErrorDialog
        message={errorMessage}
        hideDialog={() => setErrorMessage(null)}
      />

      <NoteForm
        display={showNoteForm}
        createNote={handleNoteCreate}
        hideDialog={() => setShowNoteForm(false)}
        setErrorMessage={setErrorMessage}
      />

      <div className={classes.appBarSpacer} />
      <Container component="main">
        {notes.length === 0
          ? (
            <>
              {/* TODO: display a user guide */}
              <div>点击右下角的按钮，开始记录您的第一条便签！</div>
            </>
          )
          : (
            <Notes
              notes={notes}
              updateNote={handleNoteUpdate}
              deleteNote={handleNoteDelete}
              setErrorMessage={setErrorMessage}
            />
          )}

        <div className={classes.fabSpacer} />
      </Container>

      <NotificationSnackbar
        message={message}
        timeout={UNDO_TIMEOUT}
        action={snackbarAction}
        actionUndo={resetSnackbar}
      />

      {/* TODO: we might use router later */}
      {user === null ? null : <NewFab showNoteForm={() => setShowNoteForm(true)} />}
    </ThemeProvider>
  );
};

export default App;
