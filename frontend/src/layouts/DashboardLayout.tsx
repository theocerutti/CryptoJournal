import { Box, Portal } from '@chakra-ui/react';
import Footer from 'components/Footer';
import Navbar from 'components/navbar/Navbar';
import Sidebar from 'components/sidebar/Sidebar';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes/routes';

export default function Dashboard() {
  const getActiveRouteName = (routes: RouteType[]): string => {
    let activeRoute = 'Default Active Route';

    for (let i = 0; i < routes.length; i++) {
      const routeFullPath = routes[i].layout + (routes[i].path === '/' ? '' : routes[i].path);
      const pathname =
        window.location.pathname.at(-1) === '/' ? window.location.pathname.slice(0, -1) : window.location.pathname;
      if (pathname === routeFullPath) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes: RouteType[]): any => {
    return routes.map((route: RouteType, key: any) => {
      if (route.layout === '/dashboard') {
        return <Route exact path={route.layout + route.path} component={route.component} key={key} />;
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
            <Navbar brandText={getActiveRouteName(routes)} />
          </Box>
        </Portal>

        <Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
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
