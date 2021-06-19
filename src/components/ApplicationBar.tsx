import React from 'react';
import {
  Button, Typography, Toolbar, AppBar, useScrollTrigger, makeStyles,
} from '@material-ui/core';

type Props = {
  displayName: string | null,
  showLogin: () => void,
  handleLogout: () => void,
};

const useStyles = makeStyles(() => ({
  title: { flexGrow: 1 },
}));

const ApplicationBar = ({ displayName, showLogin, handleLogout }: Props) => {
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <>
      <AppBar elevation={trigger ? 4 : 0}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            便签
          </Typography>
          {displayName === null
            ? <Button color="inherit" onClick={showLogin}>登入</Button>
            : <Button color="inherit" onClick={handleLogout}>{displayName}</Button>}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default ApplicationBar;
