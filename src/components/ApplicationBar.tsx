import React from 'react';
import {
  Button, Typography, Toolbar, AppBar, makeStyles,
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          便签
        </Typography>
        {displayName === null
          ? <Button color="inherit" onClick={showLogin}>登入</Button>
          : <Button color="inherit" onClick={handleLogout}>{displayName}</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
