import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTheme, ThemeProvider, CssBaseline } from '@material-ui/core'

const theme = createTheme({})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
