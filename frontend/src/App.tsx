import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <ProtectedRoute component={DashboardLayout} path={`/dashboard`} />
    </Switch>
  );
};

export default App;
