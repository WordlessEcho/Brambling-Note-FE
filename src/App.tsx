import React from 'react';

import { Container, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { zhCN } from '@material-ui/core/locale';

import ApplicationBar from './components/ApplicationBar';

const theme = createMuiTheme({}, zhCN);

const App = () => (
  <ThemeProvider theme={theme}>
    <ApplicationBar />

    <Container component="main">
      Hello world!
    </Container>
  </ThemeProvider>
);

export default App;
