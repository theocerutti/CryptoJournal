import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import React from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes';
import {
  setRefreshTokenFromStorage,
  setTokenFromStorage,
} from '../../utils/authStorage';
import { useHistory } from 'react-router-dom';

export default function NavbarLinks() {
  const history = useHistory();
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  );

  const handleLogout = () => {
    setTokenFromStorage(null);
    setRefreshTokenFromStorage(null);
    history.push('/auth/sign-in');
  };

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems='center'
      flexDirection='row'
      bg={menuBg}
      flexWrap={'unset'}
      p='10px'
      borderRadius='30px'
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          return 'unset';
        }}
        me='10px'
        borderRadius='30px'
      />

      <SidebarResponsive routes={routes} />

      <Button
        variant='no-hover'
        bg='transparent'
        p='0px'
        minW='unset'
        minH='unset'
        h='18px'
        w='max-content'
        onClick={toggleColorMode}
      >
        <Icon
          me='10px'
          h='18px'
          w='18px'
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p='0px'>
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color='white'
            name='Profile'
            bg='#11047A'
            size='sm'
            w='40px'
            h='40px'
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p='0px'
          mt='10px'
          borderRadius='20px'
          bg={menuBg}
          border='none'
        >
          <Flex w='100%' mb='0px'>
            <Text
              ps='20px'
              pt='16px'
              pb='10px'
              w='100%'
              borderBottom='1px solid'
              borderColor={borderColor}
              fontSize='sm'
              fontWeight='700'
              color={textColor}
            >
              👋&nbsp; Hey
            </Text>
          </Flex>
          <Flex flexDirection='column' p='10px'>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius='8px'
              px='14px'
            >
              <Text fontSize='sm'>Profile Settings</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              onClick={handleLogout}
              color='red.400'
              borderRadius='8px'
              px='14px'
            >
              <Text fontSize='sm'>Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
