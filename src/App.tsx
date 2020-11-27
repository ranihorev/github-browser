import classes from '*.module.css';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';
import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Commits } from './pages/Commits';
import { Home } from './pages/Home';
import { Repos } from './pages/Repos';

const queryCache = new QueryCache();

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
