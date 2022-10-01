import React, { useEffect, useState } from 'react';
import { Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import Card from '../card/Card';
import { FaEthereum } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { DeleteIcon } from '@chakra-ui/icons';
import { InvestmentDto } from '@shared/investment';
import { scrapePrice, scrapeRegex, ScrapeSite } from '../../utils/scrap';
import { getSign } from '../../utils/math';

const Investment = ({
  investment,
  handleDelete,
}: {
  investment: InvestmentDto;
  handleDelete: (i: InvestmentDto) => void;
}) => {
  const textColor = useColorModeValue('brands.900', 'white');
  const bgItem = useColorModeValue(
    { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
    { bg: 'navy.700', boxShadow: 'unset' }
  );

  const [price, setPrice] = useState(0);

  useEffect(() => {
    scrapePrice(
      'https://coinmarketcap.com/currencies/bitcoin/',
      scrapeRegex[ScrapeSite.CoinMarketCap]
    ).then((price) => setPrice(investment.investedAmount - price));
  }, [investment.investedAmount]);

  return (
    <Card
      borderRadius='0px'
      borderLeftColor='red'
      borderWidth='5px'
      _hover={bgItem}
      bg='transparent'
      boxShadow='unset'
      px='20px'
      py='5px'
      transition='0.2s linear'
    >
      <Flex direction={{ base: 'column' }} justify='center'>
        <Flex position='relative' align='center'>
          <Flex
            direction='column'
            w={{ base: '70%', md: '20%' }}
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
          >
            <Text
              color={textColor}
              fontSize={{
                base: 'md',
              }}
              mb='5px'
              fontWeight='bold'
              me='14px'
            >
              {investment.name}
            </Text>
            <Text
              color='secondaryGray.600'
              fontSize={{
                base: 'sm',
              }}
              fontWeight='400'
              me='14px'
            >
              {formatCurrency(investment.buyPrice)}
            </Text>
          </Flex>
          <Flex
            w={{ base: '70%', md: '20%' }}
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
          >
            <Text>
              {getSign(price)}
              {formatCurrency(price)}
            </Text>
          </Flex>
          <Flex
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
            width='100%'
            align='center'
            justify='end'
          >
            <Icon as={FaEthereum} color={textColor} width='9px' me='7px' />
            <Text fontWeight='700' fontSize='md' color={textColor}>
              {investment.holdings}
            </Text>
          </Flex>
          <Flex align='center'>
            <Button
              size='sm'
              colorScheme='red'
              variant='ghost'
              onClick={() => handleDelete(investment)}
            >
              <DeleteIcon />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Investment;
