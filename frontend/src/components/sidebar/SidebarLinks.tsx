import { NavLink, useLocation } from 'react-router-dom';
import SidebarButton from '../../routes/SidebarButton';
import { activeRoute } from '../../routes/routes';

export function SidebarLinks(props: { routes: RouteType[] }) {
  const { routes } = props;
  const location = useLocation();

  const createLinks = (routes: RouteType[]) => {
    return routes
      .filter((route) => route.showNavbar === undefined || route.showNavbar === true)
      .map((route: RouteType, index: number): JSX.Element => {
        const showRouteButton = (): JSX.Element => {
          if (route.buttonComponent)
            return <span key={index}>{route.buttonComponent(activeRoute(route, location), route)}</span>;
          return (
            <NavLink key={index} to={route.layout + route.path}>
              <SidebarButton route={route} location={location} />
            </NavLink>
          );
        };

        return showRouteButton();
      });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
