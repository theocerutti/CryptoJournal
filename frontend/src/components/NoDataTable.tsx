import React from 'react';
import { Alert } from '@chakra-ui/react';

const NoDataTable = ({ message }: { message: string }) => {
  return <Alert status='warning'>{message}</Alert>;
};

export default NoDataTable;
