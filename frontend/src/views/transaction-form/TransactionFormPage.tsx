import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, HStack } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import Card from '../../components/card/Card';
import TransactionForm from './TransactionForm';
import { ASSET_QUERY_KEY, getAssetsQuery } from 'queries/asset';
import { defaultQueryConfig } from 'queries/config';
import { useQuery } from '@tanstack/react-query';
import { GetTransactionDto } from '@shared/transaction';

const TransactionFormPage = () => {
  const { isSuccess, isError, isLoading, data } = useQuery([ASSET_QUERY_KEY], getAssetsQuery, {
    ...defaultQueryConfig,
  });
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const editTransaction = !!location.state?.transaction
    ? // @ts-ignore
      (location.state.transaction as GetTransactionDto)
    : null;

  const showForm = () => {
    if (isSuccess) return <TransactionForm editTransaction={editTransaction} assets={data.data} />;
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
