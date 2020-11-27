import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Commits } from './pages/Commits';
import { Home } from './pages/Home';
import { Repos } from './pages/Repos';

const queryCache = new QueryCache();

const theme = createMuiTheme({
  palette: { primary: { main: '#e50914' } },
});

function App() {
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <ReactQueryCacheProvider queryCache={queryCache}>
            <Router>
              <AppBar position="static">
                <Toolbar variant="dense">
                  <Link to="/">
                    <Typography variant="h6">Github Browser</Typography>
                  </Link>
                </Toolbar>
              </AppBar>
              <Switch>
                <Route path="/user/:userId/repos">
                  <Repos />
                </Route>
                <Route path="/user/:userId/repo/:repoName/commits">
                  <Commits />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Router>
          </ReactQueryCacheProvider>
        </StylesProvider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
