import { Box, SimpleGrid } from '@chakra-ui/react';
import AlertPriceLoading from '../../components/AlertPriceLoading';
import GlobalInfo from './GlobalInfo';
import Card from '../../components/card/Card';
import Transactions from './transaction-table/Transactions';
import AssetPNL from './asset-pnl-table/AssetPNL';

export default function Dashboard() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <AlertPriceLoading />

      <GlobalInfo />

      {/*<SimpleGrid gap='20px' mb='20px'>*/}
      {/*  <ChartBalance />*/}
      {/*</SimpleGrid>*/}

      <SimpleGrid gap='20px' mb='20px'>
        <Card>
          <AssetPNL />
        </Card>
      </SimpleGrid>

      <SimpleGrid gap='20px' mb='20px'>
        <Card>
          <Transactions />
        </Card>
      </SimpleGrid>
    </Box>
  );
}
