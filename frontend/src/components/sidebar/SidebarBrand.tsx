import { Flex, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from 'components/Separator';
import { Text } from '@chakra-ui/react';

export function SidebarBrand() {
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems='center' flexDirection='column'>
      <Text fontSize='24px' fontWeight='bold' color={logoColor}>
        Crypto Journal
      </Text>
      <HSeparator my='20px' />
    </Flex>
  );
}

export default SidebarBrand;
