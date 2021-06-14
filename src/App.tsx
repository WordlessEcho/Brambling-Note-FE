import React from 'react';

import { Container, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { zhCN } from '@material-ui/core/locale';

const theme = createMuiTheme({}, zhCN);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component='main'>
        Hello world!
      </Container>
    </ThemeProvider>
  );
};

export default App;
