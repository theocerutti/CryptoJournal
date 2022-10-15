import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import ChartTotalInvested from './ChartTotalInvested';
import ChartFees from './ChartFees';
import ChartAssets from './ChartAssets';
import ChartBalance from './ChartBalance';
import ChartBalanceByAsset from './ChartBalanceByAsset';
import ChartInvestedByAsset from './ChartInvestedByAsset';

/*
ChartBalance LineChart: balance over time
ChartFees: linechart fees over lime
ChartAssets: donut chart of assets (percentage)
ChartBalanceByAsset: donut chart balance by asset
ChartInvestedByAsset: donut chart invested by asset
ChartTotalInvested: linechart total invested over time
*/

const Charts = () => {
  return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
    <SimpleGrid gap='20px' mb='20px'>
    <ChartTotalInvested/>
    </SimpleGrid>
    <SimpleGrid gap='20px' mb='20px'>
      <ChartFees/>
    </SimpleGrid>
    <SimpleGrid gap='20px' mb='20px'>
      <ChartAssets/>
    </SimpleGrid>
    <SimpleGrid gap='20px' mb='20px'>
      <ChartBalance/>
    </SimpleGrid>
    <SimpleGrid gap='20px' mb='20px'>
      <ChartBalanceByAsset />
    </SimpleGrid>
    <SimpleGrid gap='20px' mb='20px'>
      <ChartInvestedByAsset/>
    </SimpleGrid>
  </Box>;
};

export default Charts;
