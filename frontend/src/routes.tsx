import { Icon } from '@chakra-ui/react';
import { MdHome, MdOutlinePlaylistAdd } from 'react-icons/md';
import MainDashboard from 'views/dashboard';
import AddInvestmentPage from './views/add-investment';

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
];

export default routes;
