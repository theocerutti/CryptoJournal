import React from 'react';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import TransactionsContainer from './TransactionsContainer';
import { useHistory } from 'react-router-dom';

const Transactions = () => {
  const history = useHistory();
  const textColor = useColorModeValue('brands.900', 'white');

  return (
    <>
      <Flex align={{ sm: 'flex-start', lg: 'center' }} justify='space-between' pb='20px' w='100%'>
        <Text color={textColor} fontSize='xl' fontWeight='600'>
          Transactions History
        </Text>
        <Button variant='action' onClick={() => history.push('/dashboard/add-transaction')}>
          +
        </Button>
      </Flex>

      <TransactionsContainer />
    </>
  );
};

export default Transactions;
