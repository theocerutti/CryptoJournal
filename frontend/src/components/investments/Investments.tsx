import React from 'react';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import InvestmentList from './InvestmentList';
import { useHistory } from 'react-router-dom';

const Investments = () => {
  const history = useHistory();
  const textColor = useColorModeValue('brands.900', 'white');

  return (
    <>
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify='space-between'
        pb='20px'
        w='100%'
      >
        <Text color={textColor} fontSize='xl' fontWeight='600'>
          Investments
        </Text>
        <Button
          variant='action'
          onClick={() => history.push('/dashboard/add-investment')}
        >
          +
        </Button>
      </Flex>

      <InvestmentList />
    </>
  );
};

export default Investments;
