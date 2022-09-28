import React, { useState } from 'react';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import AddInvestmentModal from './AddInvestmentModal';
import InvestmentList from './InvestmentList';

const Investments = () => {
  const [isAddModalOpen, showAddModal] = useState(false);
  const textColor = useColorModeValue('brands.900', 'white');

  const handleAdd = (investment: any) => {
    console.log(investment);
  };

  return (
    <>
      <AddInvestmentModal
        isOpen={isAddModalOpen}
        onClose={() => showAddModal(false)}
        onAdd={handleAdd}
      />

      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify='space-between'
        pb='20px'
        w='100%'
      >
        <Text color={textColor} fontSize='xl' fontWeight='600'>
          Investments
        </Text>
        <Button variant='action' onClick={() => showAddModal(true)}>
          +
        </Button>
      </Flex>

      <InvestmentList />
    </>
  );
};

export default Investments;
