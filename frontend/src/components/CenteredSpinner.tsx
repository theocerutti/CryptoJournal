import React from 'react';
import { Flex, Spinner, SpinnerProps } from '@chakra-ui/react';

const CenteredSpinner = (props: SpinnerProps) => {
  return (
    <Flex width='100%' height='100%' justify='center' align='center'>
      <Spinner {...props} />
    </Flex>
  );
};

export default CenteredSpinner;
