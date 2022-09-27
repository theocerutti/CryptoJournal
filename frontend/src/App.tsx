import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <ProtectedRoute component={AdminLayout} path={`/admin`} />
      <Redirect from='/' to='/admin' />
    </Switch>
  );
};

export default App;
