import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGlobalInfoQuery, GLOBAL_INFO_QUERY_KEY } from '../../queries/global-info';
import { defaultQueryConfig } from '../../queries/config';
import { Alert, Box, SimpleGrid } from '@chakra-ui/react';
import CenteredSpinner from '../../components/CenteredSpinner';
import { formatCurrency } from '../../utils/format';
import { MdAccountBalanceWallet, MdAttachMoney, MdBarChart, MdConfirmationNumber, MdWebAsset } from 'react-icons/md';
import NumberChart from '../../components/charts/NumberChart';
import ChartTotalInvested from './ChartTotalInvested';
import ChartFees from './ChartFees';

const Charts = () => {
  const { data, isError, isLoading, isSuccess } = useQuery([GLOBAL_INFO_QUERY_KEY], getGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (isLoading) return <CenteredSpinner />;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid gap='20px' mb='20px' columns={5}>
        <NumberChart
          title='Total Balance'
          value={formatCurrency(data.data.totalBalance)}
          logo={MdAccountBalanceWallet}
        />
        <NumberChart title='Total Invested' value={formatCurrency(data.data.totalInvested)} logo={MdBarChart} />
        <NumberChart title='Total Fees' value={formatCurrency(data.data.totalFees)} logo={MdAttachMoney} />
        <NumberChart
          title='Total Transactions'
          value={data.data.transactionsCount.toString()}
          logo={MdConfirmationNumber}
        />
        <NumberChart title='Total Asset' value={data.data.assetsCount.toString()} logo={MdWebAsset} />
      </SimpleGrid>
      <SimpleGrid gap='20px' mb='20px' columns={2}>
        <ChartTotalInvested />
        <ChartFees />
      </SimpleGrid>
    </Box>
  );
};

export default Charts;
