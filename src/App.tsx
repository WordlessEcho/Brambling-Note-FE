import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, ThemeProvider, Theme, createStyles, makeStyles, createTheme,
} from '@material-ui/core';
import { zhCN } from '@material-ui/core/locale';

import {
  ErrorMessage, LoginUser, NewNote, NewPassword, NewUser, Note, SnackbarMessage, User,
} from './types';
import loginService from './services/login';
import userService from './services/user';
import emailService from './services/email';
import noteService from './services/note';
import { toErrorMessage, toUser } from './utils';

import ApplicationBar from './components/ApplicationBar';
import Login from './components/Login';
import EditPassword from './components/EditPassword';
import Register from './components/Register';
import ErrorDialog from './components/ErrorDialog';
import NoteForm from './components/NoteForm';
import Notes from './components/Notes';
import NotificationSnackbar from './components/NotificationSnackbar';
import NewFab from './components/NewFab';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Noto Sans SC',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
}, zhCN);
const useStyles = makeStyles((t: Theme) => createStyles({
  appBarSpacer: t.mixins.toolbar,
  fabSpacer: {
    height: t.spacing(11),
  },
}));

const UNDO_TIMEOUT = 5000;

const App = () => {
  const classes = useStyles();

  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [snackbarActionUndo, setSnackbarActionUndo] = useState<(() => any) | null>(null);

  const hideSnackbar = () => {
    setMessage(null);
    setSnackbarActionUndo(null);
  };

  const setSnackbar: SnackbarMessage = (content, actionUndo) => {
    setMessage(content);
    setSnackbarActionUndo(actionUndo);
  };

  const handleLogin = (loginUser: LoginUser) => (
    loginService.login(loginUser)
      .then((u) => setUser(u))
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    noteService.clearToken();
    setUser(null);
  };

  const handleRegister = (newUser: NewUser) => userService.create(newUser);
  const getActivateState = (email: string) => userService.isVerified(email);
  const resendVerifyEmail = (email: string) => emailService.resendVerify(email);

  const handleEditPassword = async (newPassword: NewPassword) => {
    if (!(user && user.email)) {
      // TODO: use constract instand of hard code
      throw new Error('User email is null');
    }

    // TODO: possible to revoke json web token?
    return userService.changePassword({ ...newPassword, email: user.email });
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

  const handleNoteDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);

    // cannot find the note in local cache
    // TODO: reload notes from server
    if (!note) {
      setErrorMessage({ title: '找不到您要删除的便签', content: '请刷新后重试' });
    } else {
      // make undoNoteRemove to get right notes
      const filteredNotes = notes.filter((n) => n.id !== id);
      // remove note from UI
      setNotes(filteredNotes);

      noteService.remove(id)
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 404) {
              return setErrorMessage({ title: '您要删除的便签已不存在', content: null });
            }
          }

          const friendlyLog = toErrorMessage(error);
          return setErrorMessage(friendlyLog);
        });

      const undoNoteRemove = () => (
        noteService.undoRemove(id)
          // add note back
          // notes in state will not auto update here
          .then((returnedNote) => setNotes(filteredNotes.concat(returnedNote)))
          .catch((error) => {
            // it should not happened unless we forgot to reset the Snackbar
            // TODO: reload notes from server
            if (error.response && error.response.status === 404) {
              return setErrorMessage({ title: '您要恢复的便签已不存在', content: null });
            }

            const friendlyLog = toErrorMessage(error);
            return setErrorMessage(friendlyLog);
          })
      );

      setSnackbar(
        `便签「${note.content}」已被删除`,
        // idk why I have to make it as arrow function, but it works
        // see setCacheUndo() in components/NotificationSnackbar.tsx
        () => undoNoteRemove,
      );
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
        showEditPassword={() => setShowEditPassword(true)}
        showRegister={() => setShowRegister(true)}
      />

      <Login
        display={showLogin}
        hideDialog={() => setShowLogin(false)}
        login={handleLogin}
        setErrorMessage={setErrorMessage}
      />

      <EditPassword
        display={showEditPassword}
        hideDialog={() => setShowEditPassword(false)}
        editPassword={handleEditPassword}
        setSnackbar={setSnackbar}
        setErrorMessage={setErrorMessage}
      />

      <Register
        display={showRegister}
        hideDialog={() => setShowRegister(false)}
        register={handleRegister}
        getActivateState={getActivateState}
        resendEmail={resendVerifyEmail}
        setSnackbar={setSnackbar}
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
        actionUndo={snackbarActionUndo}
        hideSnackbar={hideSnackbar}
      />

      {/* TODO: we might use router later */}
      {user === null
        ? null
        : <NewFab message={message} showNoteForm={() => setShowNoteForm(true)} />}
    </ThemeProvider>
  );
};

export default App;
