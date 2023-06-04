import React from 'react';
import {
  Button, Typography, Toolbar, AppBar, useScrollTrigger,
} from '@mui/material';

type Props = {
  displayName: string | null,
  showLogin: () => void,
  showRegister: () => void,
  showEditPassword: () => void,
  handleLogout: () => void,
};

export default function ApplicationBar({
  displayName, showLogin, showRegister, showEditPassword, handleLogout,
}: Props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <>
      <AppBar elevation={trigger ? 4 : 0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            燕雀便签
          </Typography>
          {displayName === null
            ? (
              <>
                <Button color="inherit" onClick={showRegister}>注册</Button>
                <Button color="inherit" onClick={showLogin}>登入</Button>
              </>
            )
            : (
              <>
                <Button color="inherit" onClick={showEditPassword}>修改密码</Button>
                <Button color="inherit" onClick={handleLogout}>{displayName}</Button>
              </>
            )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
