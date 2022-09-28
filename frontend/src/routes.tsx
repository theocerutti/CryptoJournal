import { Icon } from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';
import MainDashboard from 'views/dashboard';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/dashboard',
    path: '/',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
];

export default routes;
