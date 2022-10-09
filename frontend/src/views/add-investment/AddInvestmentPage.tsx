import React from 'react';
import { Box } from '@chakra-ui/react';
import InvestmentForm from './InvestmentForm';
import Card from 'components/card/Card';
import { BsArrowLeft } from 'react-icons/bs';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, HStack } from '@chakra-ui/react';
import { GetInvestmentDto } from '@shared/investment';

const AddInvestmentPage = () => {
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const editInvestment = !!location.state?.investment ? (location.state.investment as GetInvestmentDto) : null;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Button onClick={() => history.push('/dashboard')}>
        <HStack spacing='5px'>
          <BsArrowLeft />
          <div>Back</div>
        </HStack>
      </Button>
      <Card my='20px'>
        <InvestmentForm editInvestment={editInvestment} />
      </Card>
    </Box>
  );
};

export default AddInvestmentPage;
