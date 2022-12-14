import React from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import ColorToggle from '../../components/ColorToggle';
import { useMutation } from '@tanstack/react-query';
import { setRefreshTokenFromStorage, setTokenFromStorage } from '../../utils/authStorage';
import { loginMutation, registerMutation } from '../../queries/auth';
import { CreateUserDTO, LoginUserDTO } from '@shared/auth';

function Auth({ type }: { type: 'sign-in' | 'sign-up' }) {
  const location = useLocation();
  const history = useHistory();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'grey.500';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGrey.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleShowPassword = () => setShow(!show);

  const authenticateMutation = (mutationArgs: LoginUserDTO | CreateUserDTO) => {
    if (type === 'sign-in') {
      return loginMutation(mutationArgs);
    } else {
      return registerMutation(mutationArgs);
    }
  };

  const mutation = useMutation(authenticateMutation, {
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data.payload;
      setTokenFromStorage(access_token);
      setRefreshTokenFromStorage(refresh_token);
      history.push('/dashboard/');
    },
  });

  const handleAuth = () => {
    mutation.mutate({
      email: email,
      password: password,
    });
  };

  return (
    <Flex justify='center' align='center'>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w='100%'
        mx={{ base: 'auto', lg: '0px' }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection='column'
      >
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </Heading>
          <Text mb='36px' ms='4px' color={textColorSecondary} fontWeight='400' fontSize='md'>
            Enter your email and password to {type === 'sign-in' ? 'sign in' : 'sign up'} !
          </Text>
        </Box>
        {mutation.isError && (
          <Alert status='error' mb={'20px'}>
            <AlertIcon />
            Can't {type === 'sign-in' ? 'sign in' : 'sign up'} with provided
          </Alert>
        )}
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: '100%', md: '420px' }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: 'auto', lg: 'unset' }}
          me='auto'
          mb={{ base: '20px', md: 'auto' }}
        >
          <FormControl>
            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' color={textColor} mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              id='email'
              value={email}
              variant='auth'
              fontSize='sm'
              ms={{ base: '0px', md: '0px' }}
              type='email'
              placeholder='mail@mail.com'
              mb='24px'
              fontWeight='500'
              size='lg'
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                value={password}
                id='password'
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                onChange={(e) => setPassword(e.target.value)}
                type={show ? 'text' : 'password'}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleShowPassword}
                />
              </InputRightElement>
            </InputGroup>
            <Button
              isLoading={mutation.isLoading}
              onClick={handleAuth}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
            >
              {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </Button>
          </FormControl>
          <Flex flexDirection='column' justifyContent='center' alignItems='start' maxW='100%' mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              {type === 'sign-in' ? 'Not registered yet?' : 'Already have an account?'}
              <NavLink to={`/auth/${type === 'sign-in' ? 'sign-up' : 'sign-in'}`}>
                <Text color={textColorBrand} as='span' ms='5px' fontWeight='500'>
                  {type === 'sign-in' ? 'Create an Account' : 'Sign In'}
                </Text>
              </NavLink>
            </Text>
            {location.state && (
              <Alert mt='10px' status='warning'>
                {/* @ts-ignore */}
                {location.state.alertMessage}
              </Alert>
            )}
          </Flex>
          <ColorToggle />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Auth;
