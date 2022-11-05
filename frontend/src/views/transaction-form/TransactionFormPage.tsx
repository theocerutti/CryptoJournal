import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, HStack } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import Card from '../../components/card/Card';
import { GetTransactionDto } from '@shared/transaction';
import TransactionForm from './TransactionForm';

const TransactionFormPage = () => {
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const editTransaction = !!location.state?.transaction
    ? // @ts-ignore
      (location.state.transaction as GetTransactionV2Dto)
    : null;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Button onClick={() => history.push('/dashboard')}>
        <HStack spacing='5px'>
          <BsArrowLeft />
          <div>Back</div>
        </HStack>
      </Button>
      <Card my='20px'>
        <TransactionForm editTransaction={editTransaction} />
      </Card>
    </Box>
  );
};

export default TransactionFormPage;
