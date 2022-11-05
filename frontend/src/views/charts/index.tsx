import React from 'react';

const Charts = () => {
  return <div></div>;
  // const { data, isError, isLoading, isSuccess } = useQuery(
  //   [INVESTMENT_GLOBAL_INFO_QUERY_KEY],
  //   getInvestmentsGlobalInfoQuery,
  //   {
  //     ...defaultQueryConfig,
  //   }
  // );
  //
  // if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  // if (isLoading) return <CenteredSpinner />;
  //
  // return (
  //   <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
  //     <SimpleGrid gap='20px' mb='20px' columns={5}>
  //       <NumberChart
  //         title='Total Balance'
  //         value={formatCurrency(data.data.totalBalance)}
  //         logo={MdAccountBalanceWallet}
  //       />
  //       <NumberChart title='Total Fees' value={formatCurrency(data.data.totalFees)} logo={MdAttachMoney} />
  //       <NumberChart
  //         title='Total Investment'
  //         value={data.data.investmentCount.toString()}
  //         logo={MdConfirmationNumber}
  //       />
  //       <NumberChart title='Total Asset' value={data.data.investmentNameCount.toString()} logo={MdWebAsset} />
  //       <NumberChart title='Total Invested' value={formatCurrency(data.data.totalInvested)} logo={MdBarChart} />
  //     </SimpleGrid>
  //     <SimpleGrid gap='20px' mb='20px' columns={2}>
  //       <ChartTotalInvested />
  //       <ChartFees />
  //     </SimpleGrid>
  //     <SimpleGrid gap='20px' mb='20px' columns={3}>
  //       <ChartAssets />
  //       <ChartInvestmentStatus />
  //       <ChartInvestedByAsset />
  //     </SimpleGrid>
  //     <SimpleGrid gap='20px' mb='20px'>
  //       <TableInvestmentInfoByAsset />
  //     </SimpleGrid>
  //   </Box>
  // );
};

export default Charts;
