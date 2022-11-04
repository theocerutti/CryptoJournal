import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import React from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes/routes';
import { deleteRefreshTokenFromStorage, deleteTokenFromStorage } from '../../utils/authStorage';
import { useHistory } from 'react-router-dom';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import TextCopy from '../TextCopy';
import { SiBinance, SiBitcoinsv, SiEthereum } from 'react-icons/si';
import { TbCurrency } from 'react-icons/tb';

export default function NavbarLinks() {
  const history = useHistory();
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarIcon = useColorModeValue('grey.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGrey.900', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  );

  const handleLogout = () => {
    deleteRefreshTokenFromStorage();
    deleteTokenFromStorage();
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
      px='20px'
      borderRadius='30px'
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />

      <Menu>
        <MenuButton p='0px'>
          <Icon mt='6px' as={MdOutlineVolunteerActivism} color={navbarIcon} w='18px' h='18px' me='10px' />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p='20px'
          borderRadius='20px'
          bg={menuBg}
          border='none'
          mt='22px'
          me={{ base: '30px', md: 'unset' }}
          minW={{ base: 'unset', md: '400px', xl: '450px' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex w='100%' mb='20px'>
            <Text fontSize='md' fontWeight='600' color={textColor}>
              Donate to the project!
            </Text>
          </Flex>
          <Flex flexDirection='column'>
            <Box py='5px'>
              <Flex alignItems='center'>
                <Icon mr='5px' as={SiEthereum} />
                <Text fontWeight='bold'>ETH (ERC20):</Text>
              </Flex>
              <TextCopy>0x17ded84d45b28d5ea359bb1b3a6343ff97a94217</TextCopy>
            </Box>
            <Box py='5px'>
              <Flex alignItems='center'>
                <Icon mr='5px' as={SiBitcoinsv} />
                <Text fontWeight='bold'>BTC:</Text>
              </Flex>
              <TextCopy>1GEqsD4YFW9P4ihfceRuF9HDcsAv1jNnSF</TextCopy>
            </Box>
            <Box py='5px'>
              <Flex alignItems='center'>
                <Icon mr='5px' as={TbCurrency} />
                <Text fontWeight='bold'>Nexo Referral:</Text>
              </Flex>
              <Link href='https://nexo.io/ref/c4ey5fhjuf?src=web-link' isExternal>
                https://nexo.io/ref/c4ey5fhjuf?src=web-link
              </Link>
            </Box>
            <Box py='5px'>
              <Flex alignItems='center'>
                <Icon mr='5px' as={SiBinance} />
                <Text fontWeight='bold'>Binance Referral:</Text>
              </Flex>
              <Link href='https://accounts.binance.com/en/register?ref=374537611' isExternal>
                https://accounts.binance.com/en/register?ref=374537611
              </Link>
            </Box>
          </Flex>
        </MenuList>
      </Menu>

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
        <Icon me='10px' h='18px' w='18px' color={navbarIcon} as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
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
        <MenuList boxShadow={shadow} p='0px' mt='10px' borderRadius='20px' bg={menuBg} border='none'>
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
              onClick={() => history.push('/dashboard/profile')}
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
