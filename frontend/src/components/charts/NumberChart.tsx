import React, { ReactNode } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import Card from 'components/card/Card';

type ChartNumberProps = {
  children: ReactNode;
};

const NumberChart = ({ children }: ChartNumberProps) => {
  return (
    <Card>
      <Flex justify='center'>
        <Heading as='h1' size='lg'>
          {children}
        </Heading>
      </Flex>
    </Card>
  );
};

export default NumberChart;
