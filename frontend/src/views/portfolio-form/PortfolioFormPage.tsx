import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, HStack } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import Card from '../../components/card/Card';
import { GetPortfolioDto } from '@shared/portfolio';
import PortfolioForm from './PortfolioForm';

const PortfolioFormPage = () => {
  const history = useHistory();
  const location = useLocation();

  // @ts-ignore
  const editPortfolio = !!location.state?.portfolio
    ? // @ts-ignore
      (location.state.portfolio as GetPortfolioDto)
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
        <PortfolioForm editPortfolio={editPortfolio} />
      </Card>
    </Box>
  );
};

export default PortfolioFormPage;
