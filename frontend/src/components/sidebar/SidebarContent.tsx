import { Box, Flex, Stack } from '@chakra-ui/react';
import SidebarBrand from 'components/sidebar/SidebarBrand';
import SidebarLinks from 'components/sidebar/SidebarLinks';

function SidebarContent(props: { routes: RoutesType[] }) {
  const { routes } = props;

  return (
    <Flex id='sidebar-content' direction='column' height='100%' pt='25px' borderRadius='30px'>
      <SidebarBrand />
      <Stack direction='column' mt='8px' mb='auto'>
        <Box ps='20px' pe={{ lg: '16px', '2xl': '16px' }}>
          <SidebarLinks routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
