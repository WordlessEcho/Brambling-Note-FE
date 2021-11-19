import React, { useState } from 'react';
import axios from 'axios';
import {
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
  createStyles, Theme, makeStyles,
} from '@material-ui/core';
import { ErrorMessage, NewPassword, SnackbarMessage } from '../types';
import { toErrorMessage } from '../utils';

type Props = {
  display: boolean,
  hideDialog: () => void,
  editPassword: (arg: NewPassword) => Promise<void>,
  setSnackbar: SnackbarMessage,
  setErrorMessage: (message: ErrorMessage) => void,
};

const useStyles = makeStyles(({ spacing }: Theme) => createStyles({
  afterInput: {
    marginTop: spacing(1),
  },
}));

const EditPassword = ({
  display, hideDialog, editPassword, setSnackbar, setErrorMessage,
}: Props) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const handleExit = () => {
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    hideDialog();
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    editPassword({ password, newPassword, confirmPassword })
      // TODO: possible to revoke json web token?
      .then(() => setSnackbar('密码修改成功。', null))
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            return setErrorMessage({ title: '您输入的密码有误', content: null });
          }
        }

        // TODO: use constract instand of hard code
        if (error.message === 'User email is null') {
          return setErrorMessage({ title: '请重新登入后再试', content: null });
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
            color="primary"
            fullWidth
            label="旧密码"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <TextField
            className={classes.afterInput}
            color="primary"
            fullWidth
            label="新密码"
            type="password"
            value={newPassword}
            onChange={({ target }) => setNewPassword(target.value)}
          />
          <TextField
            className={classes.afterInput}
            color="primary"
            fullWidth
            label="再次输入新密码"
            type="password"
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
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
            修改
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPassword;
