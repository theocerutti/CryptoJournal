import React from 'react';
import { Flex, Highlight, Icon, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import IconBox from '../IconBox';
import { IconType } from 'react-icons';

type ChartNumberProps = {
  title: string;
  value: string;
  logo?: IconType;
};

const NumberChart = ({ title, value, logo }: ChartNumberProps) => {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGrey.300', 'whiteAlpha.100');

  return (
    <Card padding='16px'>
      <Flex justify='center' align='center' flexDirection={'row'}>
        {logo && (
          <span style={{ marginRight: '8px' }}>
            <IconBox w='48px' h='48px' bg={boxBg} icon={<Icon w='24px' h='24px' as={logo} color={brandColor} />} />
          </span>
        )}
        <Highlight query={value} styles={{ paddingLeft: '4px', fontSize: '20px', color: 'grey.400' }}>
          {`${title}: ${value}`}
        </Highlight>
      </Flex>
    </Card>
  );
};

export default NumberChart;
