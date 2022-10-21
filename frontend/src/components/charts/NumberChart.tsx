import React from 'react';
import { Flex, Highlight } from '@chakra-ui/react';
import Card from 'components/card/Card';

type ChartNumberProps = {
  title: string;
  value: string;
};

const NumberChart = ({ title, value }: ChartNumberProps) => {
  return (
    <Card>
      <Flex justify='center' align='center'>
        <Highlight query={value} styles={{ paddingLeft: '4px', fontSize: '20px', color: 'grey.400' }}>
          {`${title}: ${value}`}
        </Highlight>
      </Flex>
    </Card>
  );
};

export default NumberChart;
