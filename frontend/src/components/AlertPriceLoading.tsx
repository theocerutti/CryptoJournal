import React from 'react';
import CenteredSpinner from './CenteredSpinner';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { defaultQueryConfig } from '../queries/config';
import { useQuery } from '@tanstack/react-query';
import { getGlobalInfoQuery, GLOBAL_INFO_QUERY_KEY } from '../queries/global-info';

const AlertPriceLoading = () => {
  const { data, isError, isLoading } = useQuery([GLOBAL_INFO_QUERY_KEY], getGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (isError) {
    return (
      <Alert status='error' mb='24px'>
        <AlertIcon />
        Can't load global info. Please contact an administrator.
      </Alert>
    );
  }

  if (data && data.data && data.data.hasScrapedPrices === false) {
    return (
      <Alert status='warning' mb='24px'>
        <AlertIcon />
        Prices may be wrong. Please wait a few minutes.
      </Alert>
    );
  }

  return null;
};

export default AlertPriceLoading;
