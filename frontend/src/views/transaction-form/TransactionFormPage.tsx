import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, HStack } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import Card from '../../components/card/Card';
import TransactionForm from './TransactionForm';
import { ASSET_QUERY_KEY, getAssetsQuery } from 'queries/asset';
import { defaultQueryConfig } from 'queries/config';
import { useQueries } from '@tanstack/react-query';
import { GetTransactionDto } from '@shared/transaction';
import { getPortfoliosQuery, PORTFOLIO_QUERY_KEY } from '../../queries/portfolio';

const TransactionFormPage = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: [ASSET_QUERY_KEY],
        queryFn: getAssetsQuery,
        ...defaultQueryConfig,
      },
      {
        queryKey: [PORTFOLIO_QUERY_KEY],
        queryFn: getPortfoliosQuery,
        ...defaultQueryConfig,
      },
    ],
  });
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const editTransaction = !!location.state?.transaction
    ? // @ts-ignore
      (location.state.transaction as GetTransactionDto)
    : null;

  const isSuccess = queries.every((query) => query.isSuccess);
  const isError = queries.find((query) => query.isError);
  const isLoading = queries.find((query) => query.isLoading);
  const dataAssets = queries[0].data;
  const dataPortfolios = queries[1].data;

  const showForm = () => {
    if (isSuccess)
      return (
        <TransactionForm editTransaction={editTransaction} assets={dataAssets.data} portfolios={dataPortfolios.data} />
      );
    if (isError) return <div>Error</div>;
    if (isLoading) return <div>Loading...</div>;
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Button onClick={() => history.push('/dashboard')}>
        <HStack spacing='5px'>
          <BsArrowLeft />
          <div>Back</div>
        </HStack>
      </Button>
      <Card my='20px'>{showForm()}</Card>
    </Box>
  );
};

export default TransactionFormPage;
