import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { getSign } from '../../utils/math';
import { formatCurrency } from '../../utils/format';

export default function Default(props: {
  startContent?: JSX.Element;
  endContent?: JSX.Element;
  name: string;
  growth?: number;
  growthPercent?: number | null;
  value: number;
}) {
  const { startContent, endContent, name, growth, value, growthPercent } =
    props;
  const textColor = useColorModeValue('secondaryGrey.900', 'white');
  const textColorSecondary = 'secondaryGrey.600';

  const getGrowthColor = () => {
    if (growth === 0) return textColorSecondary;
    return growth > 0 ? 'green.500' : 'red.500';
  };

  return (
    <Card py='15px'>
      <Flex
        my='auto'
        h='100%'
        align={{ base: 'center', xl: 'start' }}
        justify={{ base: 'center', xl: 'center' }}
      >
        {startContent}

        <Stat my='auto' ms={startContent ? '18px' : '0px'}>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize={{
              base: 'sm',
            }}
          >
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: '2xl',
            }}
          >
            {formatCurrency(value)}
          </StatNumber>
          {growth ? (
            <Flex align='center'>
              <Text
                color={getGrowthColor()}
                fontSize='xs'
                fontWeight='700'
                me='5px'
              >
                {getSign(growth)}
                {formatCurrency(Math.abs(growth))}{' '}
                {growthPercent !== null && `(${growthPercent.toFixed(2)}%)`}
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
