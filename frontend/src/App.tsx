import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { setupYup } from './utils/yup';

const App = () => {
  return (
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <ProtectedRoute component={DashboardLayout} path={`/dashboard`} />
      <Redirect to={`/auth/sign-in`} />
    </Switch>
  );
};

export default App;
