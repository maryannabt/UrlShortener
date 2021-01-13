import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import 'materialize-css';

import Auth from './pages/Auth';
import Links from './pages/Links';
import NewLink from './pages/NewLink';
import LinkInfo from './pages/LinkInfo';

const App = () => {
  const token = false;

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/links" exact>
          <Links />
        </Route>
        <Route path="/links/new" exact>
          <NewLink />
        </Route>
        <Route path="/links/:linkId">
          <LinkInfo />
        </Route>
        <Redirect to="/links/new" />
      </Switch>
    );
  } else {
    routes = (
    <Switch>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Redirect to="/auth" />
    </Switch>
    );
  }

  return (
    <Router>
      <div className="container">
        {routes}
      </div>
    </Router>
  );
};

export default App;
