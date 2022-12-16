import React from 'react';
import { Alert, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import CenteredSpinner from '../../components/CenteredSpinner';
import { defaultQueryConfig } from '../../queries/config';
import MiniStatistics from '../../components/card/MiniStatistics';
import { MdAccountBalanceWallet, MdAttachMoney, MdBarChart } from 'react-icons/md';
import IconBox from '../../components/IconBox';
import { getGlobalInfoQuery, GLOBAL_INFO_QUERY_KEY } from '../../queries/global-info';

const GlobalInfo = () => {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGrey.300', 'whiteAlpha.100');
  const { data, isError, isLoading } = useQuery([GLOBAL_INFO_QUERY_KEY], getGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (isError) {
    return (
      <Alert status='warning' mb='20px'>
        Can't load global information. Please contact an administrator.
      </Alert>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 3 }} gap='20px' mb='20px'>
      <MiniStatistics
        startContent={
          <IconBox
            w='56px'
            h='56px'
            bg={boxBg}
            icon={<Icon w='32px' h='32px' as={MdAccountBalanceWallet} color={brandColor} />}
          />
        }
        growth={data.data.pnl}
        growthPercent={data.data.pnlPercent}
        name='Your balance'
        value={data.data.totalBalance}
      />
      <MiniStatistics
        startContent={
          <IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />
        }
        name='Total Invested'
        value={data.data.totalInvested}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w='56px'
            h='56px'
            bg={boxBg}
            icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />}
          />
        }
        name='Total Fees'
        value={data.data.totalFees}
      />
    </SimpleGrid>
  );
};

export default GlobalInfo;
