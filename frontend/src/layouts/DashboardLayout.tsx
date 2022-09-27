import { Box, Portal } from '@chakra-ui/react';
import Footer from 'components/Footer';
import Navbar from 'components/navbar/Navbar';
import Sidebar from 'components/sidebar/Sidebar';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes';

export default function Dashboard() {
  const getActiveRoute = (routes: RoutesType[]): string => {
    let activeRoute = 'Default Active Route';
    console.log(window.location.href);
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !==
          -1 ||
        (window.location.href.indexOf(routes[i].layout) !== -1 &&
          routes[i].path === '/')
      ) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((route: RoutesType, key: any) => {
      if (route.layout === '/dashboard') {
        return (
          <Route
            path={route.layout + route.path}
            component={route.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <Box>
      <Sidebar routes={routes} />
      <Box
        float='right'
        minHeight='100vh'
        height='100%'
        overflow='auto'
        position='relative'
        maxHeight='100%'
        w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
        maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
        transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
        transitionDuration='.2s, .2s, .35s'
        transitionProperty='top, bottom, width'
        transitionTimingFunction='linear, linear, ease'
      >
        <Portal>
          <Box>
            <Navbar brandText={getActiveRoute(routes)} />
          </Box>
        </Portal>

        <Box
          mx='auto'
          p={{ base: '20px', md: '30px' }}
          pe='20px'
          minH='100vh'
          pt='50px'
        >
          <Switch>
            {getRoutes(routes)}
            <Redirect from='/' to='/dashboard' />
          </Switch>
        </Box>

        <Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
