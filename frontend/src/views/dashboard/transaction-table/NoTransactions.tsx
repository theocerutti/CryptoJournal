import React from 'react';
import { Alert } from '@chakra-ui/react';

const NoTransactions = () => {
  return (
    <Alert status='warning'>
      You don't have any transactions yet. Add one to get started.
    </Alert>
  );
};

export default NoTransactions;
