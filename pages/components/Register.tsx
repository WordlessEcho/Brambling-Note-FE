import React, { useState } from 'react';
import axios from 'axios';
import {
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
  Stack,
} from '@mui/material';
import {
  ErrorMessage, NewUser, SnackbarMessage, User,
} from '../types';
import { toErrorMessage } from '../utils';

type Props = {
  display: boolean,
  hideDialog: () => void,
  register: (arg: NewUser) => Promise<User>,
  getActivateState: (email: string) => Promise<boolean>,
  resendEmail: (email: string) => Promise<void>,
  setSnackbar: SnackbarMessage,
  setErrorMessage: (message: ErrorMessage) => void,
};

export default function Register({
  display, hideDialog, register, getActivateState, resendEmail, setSnackbar, setErrorMessage,
}: Props) {
  const [email, setEmail] = useState('');
  const [userExisted, setUserExisted] = useState(false);
  const [userActivated, setUserActivated] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleExit = () => {
    setEmail('');
    setName('');
    setPassword('');
    hideDialog();
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    register({ email, name, password })
      .then(() => {
        handleExit();
        setSnackbar('请检查收件箱或垃圾邮件内的注册邮件，并点击邮件内的链接完成注册。', null);
      })
      .catch((error) => {
        const friendlyLog = toErrorMessage(error);
        return setErrorMessage(friendlyLog);
      });
  };

  const onFocusOut = () => {
    getActivateState(email).then((activated) => {
      setUserExisted(true);
      setUserActivated(activated);
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status !== 404) {
          const friendlyLog = toErrorMessage(error);
          return setErrorMessage(friendlyLog);
        }
      }

      setUserExisted(false);
      setUserActivated(false);
      return null;
    });
  };

  const handleResend = () => {
    resendEmail(email).then(hideDialog)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 429) {
            return setSnackbar('重发次数已达上限，请明天再试。', null);
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
      aria-labelledby="register-dialog-title"
    >
      <DialogTitle id="register-dialog-title">注册</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              color="primary"
              variant="standard"
              margin="dense"
              error={userExisted && userActivated}
              helperText={userExisted && userActivated ? '用户已注册' : null}
              fullWidth
              label="邮箱"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              onBlur={onFocusOut}
            />
            {userExisted && !userActivated ? (
              <Button
                color="secondary"
                fullWidth
                variant="contained"
                onClick={handleResend}
              >
                重新发送激活邮件
              </Button>
            ) : (
              <>
                <TextField
                  color="primary"
                  variant="standard"
                  margin="dense"
                  fullWidth
                  disabled={userExisted && userActivated}
                  label="昵称"
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                />
                <TextField
                  color="primary"
                  variant="standard"
                  margin="dense"
                  fullWidth
                  disabled={userExisted && userActivated}
                  label="密码"
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            onClick={handleExit}
          >
            取消
          </Button>
          <Button
            color="secondary"
            type="submit"
            disabled={userExisted && userActivated}
          >
            注册
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
