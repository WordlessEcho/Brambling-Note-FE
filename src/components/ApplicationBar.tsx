import React from 'react';

import { Typography, Toolbar, AppBar } from '@material-ui/core';

const ApplicationBar = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6'>
          便签
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
