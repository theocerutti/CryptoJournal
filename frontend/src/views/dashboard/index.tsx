import { Box, SimpleGrid } from '@chakra-ui/react';
import Investments from './investments-table/Investments';
import Card from 'components/card/Card';
import GlobalInfo from './GlobalInfo';
import ChartBalance from './ChartTotalInvested';

export default function Dashboard() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <GlobalInfo />

      <SimpleGrid gap='20px' mb='20px'>
        <ChartBalance />
      </SimpleGrid>

      <SimpleGrid gap='20px' mb='20px'>
        <Card>
          <Investments />
        </Card>
      </SimpleGrid>
    </Box>
  );
}
