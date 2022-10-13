import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GET_USER, getUserQuery } from '../../queries/user';
import { defaultQueryConfig } from '../../queries/config';
import UserForm from './UserForm';
import Card from '../../components/card/Card';

const ProfilePage = () => {
  const { isSuccess, isError, isLoading, data } = useQuery(
    [GET_USER],
    getUserQuery,
    { ...defaultQueryConfig }
  );

  const body = () => {
    if (isSuccess)
      return (
        <Card>
          <UserForm user={data.data} />
        </Card>
      );
    if (isError) return <div>Error</div>;
    if (isLoading) return <div>Loading...</div>;
  };

  return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>{body()}</Box>;
};

export default ProfilePage;
