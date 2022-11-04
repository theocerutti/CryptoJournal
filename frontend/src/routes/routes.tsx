import { Icon } from '@chakra-ui/react';
import {
  MdAccountBalanceWallet,
  MdBarChart,
  MdHome,
  MdOutlinePlaylistAdd,
  MdOutlineRepeat,
  MdPerson,
} from 'react-icons/md';
import MainDashboard from 'views/dashboard';
import InvestmentFormPage from '../views/investment-form/InvestmentFormPage';
import TransactionFormPage from '../views/transaction-form/TransactionFormPage';
import ChartsPage from '../views/charts';
import ProfilePage from '../views/profile/ProfilePage';
import PortfolioFormPage from '../views/portfolio-form/PortfolioFormPage';
import PortfolioDropdownRouteButton from './PortfolioDropdownRouteButton';

export const activeSpecificRoute = (layout: string, path: string, location: any) => {
  const fullRoutePath = buildFullRoutePath(layout, path);
  const pathname = location.pathname.at(-1) === '/' ? location.pathname.slice(0, -1) : location.pathname;
  return pathname === fullRoutePath;
};

export const activeRoute = (route: RouteType, location: any) => {
  if (route.activeOnPath) {
    for (const path of route.activeOnPath) if (activeSpecificRoute(route.layout, path, location)) return true;
    return false;
  } else return activeSpecificRoute(route.layout, route.path, location);
};

export const buildFullRoutePath = (layout: string, path: string) => {
  return (layout + (path === '/' ? '' : path)).toLowerCase();
};

const routes: RouteType[] = [
  {
    name: 'Main Dashboard',
    layout: '/dashboard',
    path: '/',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: 'Add investment',
    layout: '/dashboard',
    path: '/add-investment',
    icon: <Icon as={MdOutlinePlaylistAdd} width='20px' height='20px' color='inherit' />,
    component: InvestmentFormPage,
  },
  {
    name: 'Edit investment',
    layout: '/dashboard',
    path: '/edit-investment',
    showNavbar: false,
    component: InvestmentFormPage,
  },
  {
    name: 'Add transactions',
    layout: '/dashboard',
    path: '/add-transaction',
    icon: <Icon as={MdOutlineRepeat} width='20px' height='20px' color='inherit' />,
    component: TransactionFormPage,
  },
  {
    name: 'Edit transaction',
    layout: '/dashboard',
    path: '/edit-transaction',
    showNavbar: false,
    component: TransactionFormPage,
  },
  {
    name: 'Portfolios',
    layout: '/dashboard',
    path: '/add-portfolio',
    activeOnPath: ['/add-portfolio', '/edit-portfolio'],
    icon: <Icon as={MdAccountBalanceWallet} width='20px' height='20px' color='inherit' />,
    buttonComponent: PortfolioDropdownRouteButton,
    component: PortfolioFormPage,
  },
  {
    name: 'Edit Portfolio',
    layout: '/dashboard',
    path: '/edit-portfolio',
    showNavbar: false,
    icon: <Icon as={MdAccountBalanceWallet} width='20px' height='20px' color='inherit' />,
    component: PortfolioFormPage,
  },
  {
    name: 'Charts',
    layout: '/dashboard',
    path: '/charts',
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: ChartsPage,
  },
  {
    name: 'Profile',
    layout: '/dashboard',
    path: '/profile',
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: ProfilePage,
  },
];

export default routes;
