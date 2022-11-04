import React from 'react';
import { Box, Flex, HStack, useColorModeValue } from '@chakra-ui/react';
import { activeRoute } from './routes';
import SidebarText from './SidebarText';

const SidebarButton = ({ route, location }: { route: RouteType; location: any }) => {
  const activeIcon = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('secondaryGrey.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  if (route.icon) {
    return (
      <Box>
        <HStack spacing={activeRoute(route, location) ? '22px' : '26px'} py='5px' ps='10px'>
          <Flex w='100%' alignItems='center' justifyContent='center'>
            <Box color={activeRoute(route, location) ? activeIcon : textColor} me='18px'>
              {route.icon}
            </Box>
            <SidebarText route={route} />
          </Flex>
          <Box h='36px' w='4px' bg={activeRoute(route, location) ? brandColor : 'transparent'} borderRadius='5px' />
        </HStack>
      </Box>
    );
  } else {
    return (
      <Box>
        <HStack spacing={activeRoute(route, location) ? '22px' : '26px'} py='5px' ps='10px'>
          <SidebarText route={route} />
          <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
        </HStack>
      </Box>
    );
  }
};

export default SidebarButton;
