import React from 'react';
import { Text, useColorModeValue } from '@chakra-ui/react';
import { activeRoute, buildFullRoutePath } from './routes';

const SidebarText = ({ route }: { route: RouteType }) => {
  const activeColor = useColorModeValue('grey.700', 'white');
  const textColor = useColorModeValue('secondaryGrey.500', 'white');

  return (
    <Text
      me='auto'
      color={activeRoute(route, location) ? activeColor : textColor}
      fontWeight={activeRoute(route, location) ? 'bold' : 'normal'}
    >
      {route.name}
    </Text>
  );
};

export default SidebarText;
