import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdHome,
  MdOutlinePlaylistAdd,
  MdPerson,
} from 'react-icons/md';
import MainDashboard from 'views/dashboard';
import AddInvestmentPage from './views/add-investment';
import ChartsPage from './views/charts';
import ProfilePage from './views/profile';

const routes = [
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
    icon: (
      <Icon
        as={MdOutlinePlaylistAdd}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: AddInvestmentPage,
  },
  {
    name: 'Edit investment',
    layout: '/dashboard',
    path: '/edit-investment',
    showNavbar: false,
    component: AddInvestmentPage,
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
