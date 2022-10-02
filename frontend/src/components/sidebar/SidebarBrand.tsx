import { Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from 'components/Separator';
import Logo from 'assets/img/logo/logo.png';

export const SidebarBrand = () => {
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <span>
      <Flex
        justify='center'
        mr='16px' // cause <Scrollbars/> apply a -16px margin-right
        alignItems='center'
        flexDirection='row'
      >
        <Image src={Logo} alt='logo' w='40px' h='40px' mr='5px' />
        <Flex flexDirection='column'>
          <Text mb='-20px' fontSize='30px' fontWeight='bold' color={logoColor}>
            CRYPTO
          </Text>
          <Text fontSize='24px' fontWeight='light' color={logoColor}>
            Journal
          </Text>
        </Flex>
      </Flex>
      <HSeparator my='20px' />
    </span>
  );
};

export default SidebarBrand;
