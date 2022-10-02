import { NavLink, useLocation } from 'react-router-dom';
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';

export function SidebarLinks(props: { routes: RoutesType[] }) {
  let location = useLocation();
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600'
  );
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');

  const { routes } = props;

  const activeRoute = (routeName: string) => {
    const pathname =
      location.pathname.at(-1) === '/'
        ? location.pathname.slice(0, -1)
        : location.pathname;
    return pathname === routeName;
  };

  const createLinks = (routes: RoutesType[]) => {
    return routes
      .filter(
        (route) => route.showNavbar === undefined || route.showNavbar === true
      )
      .map((route: RoutesType, index: number): JSX.Element => {
        const fullRoutePath = (
          route.layout + (route.path === '/' ? '' : route.path)
        ).toLowerCase();

        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={activeRoute(fullRoutePath) ? '22px' : '26px'}
                  py='5px'
                  ps='10px'
                >
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box
                      color={
                        activeRoute(fullRoutePath) ? activeIcon : textColor
                      }
                      me='18px'
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(fullRoutePath) ? activeColor : textColor
                      }
                      fontWeight={
                        activeRoute(fullRoutePath) ? 'bold' : 'normal'
                      }
                    >
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={activeRoute(fullRoutePath) ? brandColor : 'transparent'}
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={activeRoute(fullRoutePath) ? '22px' : '26px'}
                  py='5px'
                  ps='10px'
                >
                  <Text
                    me='auto'
                    color={
                      activeRoute(fullRoutePath) ? activeColor : inactiveColor
                    }
                    fontWeight={activeRoute(fullRoutePath) ? 'bold' : 'normal'}
                  >
                    {route.name}
                  </Text>
                  <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
