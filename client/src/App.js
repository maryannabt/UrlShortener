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
import Navbar from './components/Navbar'
import Loader from './components/Loader';
import { useAuth } from './hooks/auth-hook';
import { AuthContext } from './context/auth-context';

const App = () => {
  const { token, login, logout, userId, ready } = useAuth();
  const isLoggedIn = !!token;

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

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider
      value={{
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        { isLoggedIn && <Navbar /> }
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
