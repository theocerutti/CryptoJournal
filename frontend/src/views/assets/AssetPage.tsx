import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, Heading, HStack, Link, useColorModeValue } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import Card from '../../components/card/Card';
import AssetForm from './AssetForm';
import { GetAssetDto } from '@shared/asset';
import AssetTableContainer from './AssetTableContainer';

const AssetPage = () => {
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const editAsset = !!location.state?.asset
    ? // @ts-ignore
      (location.state.asset as GetAssetDto)
    : null;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Button onClick={() => history.push('/dashboard')}>
        <HStack spacing='5px'>
          <BsArrowLeft />
          <div>Back</div>
        </HStack>
      </Button>
      <Card my='20px'>
        <AssetForm editAsset={editAsset} />
      </Card>
      {!editAsset && (
        <Card my='20px'>
          <AssetTableContainer />
        </Card>
      )}
    </Box>
  );
};

export default AssetPage;
