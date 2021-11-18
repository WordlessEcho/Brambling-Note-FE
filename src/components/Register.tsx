import React, { useState } from 'react';
import {
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
  createStyles, Theme, makeStyles,
} from '@material-ui/core';
import { ErrorMessage, NewUser, User } from '../types';
import { toErrorMessage } from '../utils';

type Props = {
  display: boolean,
  hideDialog: () => void,
  register: (arg: NewUser) => Promise<User>,
  getActivateState: (email: string) => Promise<boolean>,
  resendEmail: (email: string) => Promise<void>,
  setErrorMessage: (message: ErrorMessage) => void,
};

const useStyles = makeStyles(({ spacing }: Theme) => createStyles({
  afterInput: {
    marginTop: spacing(1),
  },
}));

const Register = ({
  display, hideDialog, register, getActivateState, resendEmail, setErrorMessage,
}: Props) => {
  const [email, setEmail] = useState('');
  const [userExisted, setUserExisted] = useState(false);
  const [userActivated, setUserActivated] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const handleExit = () => {
    setEmail('');
    setName('');
    setPassword('');
    hideDialog();
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    register({
      email, name, password,
      // TODO: prompt a toast while registering successfully
    }).then(() => handleExit())
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
      if (error.response.status !== 404) {
        const friendlyLog = toErrorMessage(error);
        return setErrorMessage(friendlyLog);
      }

      setUserExisted(false);
      setUserActivated(false);
      return null;
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
          <TextField
            color="primary"
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
              className={classes.afterInput}
              color="secondary"
              fullWidth
              variant="contained"
              onClick={() => resendEmail(email)}
            >
              重新发送激活邮件
            </Button>
          ) : (
            <>
              <TextField
                className={classes.afterInput}
                color="primary"
                fullWidth
                disabled={userExisted && userActivated}
                label="昵称"
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
              <TextField
                className={classes.afterInput}
                color="primary"
                fullWidth
                disabled={userExisted && userActivated}
                label="密码"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </>
          )}
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
            disabled={userExisted && userActivated}
          >
            注册
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Register;
