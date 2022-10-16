import React from 'react';
import { Alert, Box, SimpleGrid, Spinner } from '@chakra-ui/react';
import ChartTotalInvested from './ChartTotalInvested';
import ChartFees from './ChartFees';
import ChartAssets from './ChartAssets';
import ChartInvestedByAsset from './ChartInvestedByAsset';
import ChartInvestmentStatus from './ChartInvestmentStatus';
import NumberChart from '../../components/charts/NumberChart';
import { useQuery } from '@tanstack/react-query';
import {
  getInvestmentsGlobalInfoQuery,
  INVESTMENT_GLOBAL_INFO_QUERY_KEY,
} from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import TableInvestmentInfoByAsset from './TableInvestmentInfoByAsset';
import { formatCurrency } from '../../utils/format';

const Charts = () => {
  const { data, isError, isLoading, isSuccess } = useQuery(
    [INVESTMENT_GLOBAL_INFO_QUERY_KEY],
    getInvestmentsGlobalInfoQuery,
    {
      ...defaultQueryConfig,
    }
  );

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (isLoading) return <Spinner />;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid gap='20px' mb='20px' columns={5}>
        <NumberChart>
          Total Balance: {formatCurrency(data.data.totalBalance)}
        </NumberChart>
        <NumberChart>
          Total Fees: {formatCurrency(data.data.totalFees)}
        </NumberChart>
        <NumberChart>Total Investment: {data.data.investmentCount}</NumberChart>
        <NumberChart>Total Asset: {data.data.investmentNameCount}</NumberChart>
        <NumberChart>
          Total Invested: {formatCurrency(data.data.totalInvested)}
        </NumberChart>
      </SimpleGrid>
      <SimpleGrid gap='20px' mb='20px' columns={2}>
        <ChartTotalInvested />
        <ChartFees />
      </SimpleGrid>
      <SimpleGrid gap='20px' mb='20px' columns={3}>
        <ChartAssets />
        <ChartInvestmentStatus />
        <ChartInvestedByAsset />
      </SimpleGrid>
      <SimpleGrid gap='20px' mb='20px'>
        <TableInvestmentInfoByAsset />
      </SimpleGrid>
    </Box>
  );
};

export default Charts;
