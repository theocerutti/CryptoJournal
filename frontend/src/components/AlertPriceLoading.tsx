import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentsGlobalInfoQuery, INVESTMENT_GLOBAL_INFO_QUERY_KEY } from '../queries/investments';
import { defaultQueryConfig } from '../queries/config';
import { Alert, AlertIcon } from '@chakra-ui/react';
import CenteredSpinner from './CenteredSpinner';

const AlertPriceLoading = () => {
  const { data, isError, isLoading } = useQuery([INVESTMENT_GLOBAL_INFO_QUERY_KEY], getInvestmentsGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (isError) {
    return (
      <Alert status='error' mb='24px'>
        <AlertIcon />
        Can't load investments. Please contact an administrator.
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
