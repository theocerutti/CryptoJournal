import React from 'react';
import { getTokenFromStorage } from '../utils/authStorage';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({
  component: Component,
  ...restOfProps
}: {
  component: React.ElementType;
  [_: string]: any;
}) => {
  const isAuthenticated = !!getTokenFromStorage();

  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/auth/sign-in' />)}
    />
  );
};

export default ProtectedRoute;
