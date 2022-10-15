import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getInvestmentsGlobalInfoQuery,
  INVESTMENT_GLOBAL_INFO_QUERY_KEY,
} from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import { Alert, Flex, Heading, SimpleGrid, Spinner } from '@chakra-ui/react';
import GaugeChart from '../../components/charts/GaugeChart';
import Card from '../../components/card/Card';

const ChartAverageBuyPriceByAsset = () => {
  const { data, isError, isLoading } = useQuery(
    [INVESTMENT_GLOBAL_INFO_QUERY_KEY],
    getInvestmentsGlobalInfoQuery,
    {
      ...defaultQueryConfig,
    }
  );

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (isLoading) return <Spinner />;

  const infoByName = data.data.infoByName;

  return (
    <Card>
      <Flex flexDirection='column'>
        <Heading size='lg'>Average Price by Asset</Heading>
        <SimpleGrid columns={4}>
          {Object.keys(infoByName).map((name: string, index) => (
            <GaugeChart
              key={index}
              chartId={`gauge-chart-average-buy-price-by-${name}`}
              min={infoByName[name].minBuyPrice}
              max={infoByName[name].maxBuyPrice}
              value={infoByName[name].averageBuyPrice}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Card>
  );
};

export default ChartAverageBuyPriceByAsset;
