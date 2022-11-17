import React from 'react';
import { Alert } from '@chakra-ui/react';

const NoDataTable = ({ children }: { children: React.ReactNode }) => {
  return <Alert status='warning'>{children}</Alert>;
};

export default NoDataTable;
