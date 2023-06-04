import React, { useState } from 'react';
import axios from 'axios';
import {
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
} from '@mui/material';
import { ErrorMessage, LoginUser } from '../types';
import { toErrorMessage } from '../utils';

type Props = {
  display: boolean,
  hideDialog: () => void,
  login: (arg: LoginUser) => Promise<void>,
  setErrorMessage: (message: ErrorMessage) => void,
};

export default function Login({
  display, hideDialog, login, setErrorMessage,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongPwdText, setWrongPwdText] = useState<string | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleExit = () => {
    setEmail('');
    setPassword('');
    setWrongPwdText(null);
    hideDialog();
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // make error readable for inputing multiple times of wrong password
    setWrongPwdText(null);

    login({ email, password })
      .then(() => handleExit())
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            return setWrongPwdText('您输入的用户名或密码有误');
          }
        }

        const friendlyLog = toErrorMessage(error);
        return setErrorMessage(friendlyLog);
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
            error={!!wrongPwdText}
            helperText={wrongPwdText}
            color="primary"
            variant="standard"
            margin="dense"
            fullWidth
            label="邮箱"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <TextField
            error={!!wrongPwdText}
            helperText={wrongPwdText}
            color="primary"
            variant="standard"
            margin="dense"
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </DialogContent>
        <DialogActions>
          {/* TODO: add forgot password button */}
          <Button
            color="inherit"
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
}
