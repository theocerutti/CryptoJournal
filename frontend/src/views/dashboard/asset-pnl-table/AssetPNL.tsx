import React from 'react';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import AssetPNLTable from './AssetPNLTable';

const AssetPNL = () => {
  const textColor = useColorModeValue('brands.900', 'white');

  return (
    <>
      <Flex align={{ sm: 'flex-start', lg: 'center' }} justify='space-between' pb='20px' w='100%'>
        <Text color={textColor} fontSize='xl' fontWeight='600'>
          PNL by Asset
        </Text>
      </Flex>

      <AssetPNLTable />
    </>
  );
};

export default AssetPNL;
