import { Box } from '@chakra-ui/react';
import AlertPriceLoading from '../../components/AlertPriceLoading';
import GlobalInfo from './GlobalInfo';

export default function Dashboard() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <AlertPriceLoading />

      <GlobalInfo />

      {/*<SimpleGrid gap='20px' mb='20px'>*/}
      {/*  <ChartBalance />*/}
      {/*</SimpleGrid>*/}

      {/*<SimpleGrid gap='20px' mb='20px'>*/}
      {/*  <Card>*/}
      {/*    <Investments />*/}
      {/*  </Card>*/}
      {/*</SimpleGrid>*/}

      {/*<SimpleGrid gap='20px' mb='20px'>*/}
      {/*  <Card>*/}
      {/*    <Transactions />*/}
      {/*  </Card>*/}
      {/*</SimpleGrid>*/}
    </Box>
  );
}
