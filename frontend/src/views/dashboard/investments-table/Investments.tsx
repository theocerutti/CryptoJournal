import React from 'react';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import InvestmentsContainer from './InvestmentsContainer';
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
          Investments History
        </Text>
        <Button
          variant='action'
          onClick={() => history.push('/dashboard/add-investment')}
        >
          +
        </Button>
      </Flex>

      <InvestmentsContainer />
    </>
  );
};

export default Investments;
