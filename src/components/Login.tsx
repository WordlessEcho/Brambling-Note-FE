import React, { useState } from 'react';
import {
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
} from '@material-ui/core';
import { LoginUser } from '../types';

type Props = { display: boolean, hideDialog: () => void, login: (arg: LoginUser) => Promise<void> };

const Login = ({ display, hideDialog, login }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleExit = () => {
    setUsername('');
    setPassword('');
    hideDialog();
  };

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    login({ username, password })
      .then(() => handleExit())
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          // TODO: show a dialog to user
          console.warn('User input a wrong username or password');
        } else {
          // TODO: ask user to report a bug
          console.error(e.message);
        }
      });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      open={display}
      aria-labelledby="login-dialog-title"
    >
      <DialogTitle id="login-dialog-title">登入</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <TextField
            color="primary"
            fullWidth
            label="用户名"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            color="primary"
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleExit}
          >
            取消
          </Button>
          <Button
            color="secondary"
            type="submit"
          >
            登录
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Login;
