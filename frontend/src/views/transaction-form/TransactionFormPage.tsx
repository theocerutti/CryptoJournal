import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Alert, Box, Button, HStack } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import Card from '../../components/card/Card';
import TransactionForm from './TransactionForm';
import { defaultQueryConfig } from 'queries/config';
import { useQueries } from '@tanstack/react-query';
import { GetTransactionDto } from '@shared/transaction';
import { getPortfoliosQuery, PORTFOLIO_QUERY_KEY } from '../../queries/portfolio';
import { CMC_CRYPTO_BASIC_INFOS, getCryptoBasicsInfos } from '../../queries/coinmarketcap';
import CenteredSpinner from '../../components/CenteredSpinner';

const TransactionFormPage = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: [CMC_CRYPTO_BASIC_INFOS],
        queryFn: getCryptoBasicsInfos,
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
  const dataCryptoInfos = queries[0].data;
  const dataPortfolios = queries[1].data;

  const showForm = () => {
    if (isSuccess)
      return (
        <TransactionForm
          editTransaction={editTransaction}
          cryptoInfos={dataCryptoInfos.data}
          portfolios={dataPortfolios.data}
        />
      );
    if (isError) return <Alert status='error'>Can't fetch currencies informations.</Alert>;
    if (isLoading) return <CenteredSpinner />;
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
