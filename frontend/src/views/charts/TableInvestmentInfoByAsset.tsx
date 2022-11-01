import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentsGlobalInfoQuery, INVESTMENT_GLOBAL_INFO_QUERY_KEY } from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import { Alert, Flex, Heading, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react';
import Card from '../../components/card/Card';
import { formatCurrency } from 'utils/format';
import { getSign, toSpecialPrecision } from '../../utils/math';
import { getGrowthColor } from '../../utils/colors';
import CenteredSpinner from '../../components/CenteredSpinner';

const TableInvestmentInfoByAsset = () => {
  const { data, isError, isLoading } = useQuery([INVESTMENT_GLOBAL_INFO_QUERY_KEY], getInvestmentsGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (isLoading) return <CenteredSpinner />;

  const infoByName = data.data.infoByName;

  const tableColumnNames =
    !infoByName || Object.keys(infoByName).length === 0 ? [] : Object.keys(infoByName[Object.keys(infoByName)[0]]);
  const tableRows = !infoByName || Object.keys(infoByName).length === 0 ? [] : Object.keys(infoByName);

  return (
    <Card>
      <Flex flexDirection='column'>
        <Heading as='h1' size='md' paddingBottom='24px'>
          Investment Info By Asset
        </Heading>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Td>NAME</Td>
                <Td>TOTAL INVESTED</Td>
                <Td>TOTAL FEES</Td>
                <Td>BALANCE</Td>
                <Td>PNL</Td>
                <Td>AVERAGE BUY PRICE</Td>
                <Td>MIN BUY</Td>
                <Td>MAX BUY</Td>
                <Td>MIN SELL</Td>
                <Td>MAX SELL</Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableRows.length > 0 ? (
                tableRows.map((name) => {
                  const info = infoByName[name];

                  return (
                    <Tr key={name}>
                      <Td>{name}</Td>
                      <Td>{formatCurrency(info.totalInvested)}</Td>
                      <Td>{formatCurrency(info.totalFees)}</Td>
                      <Td>{formatCurrency(info.totalBalance)}</Td>
                      <Td>
                        <Text color={getGrowthColor(info.pnl)} fontSize='xs' fontWeight='700' me='5px'>
                          {getSign(info.pnl)}
                          {formatCurrency(Math.abs(info.pnl))}{' '}
                          {info.pnlPercent !== null && `(${toSpecialPrecision(info.pnlPercent)}%)`}
                        </Text>
                      </Td>
                      <Td>{formatCurrency(info.averageBuyPrice)}</Td>
                      <Td>{formatCurrency(info.minBuyPrice)}</Td>
                      <Td>{formatCurrency(info.maxBuyPrice)}</Td>
                      <Td>{info.minSellPrice === null ? '-' : formatCurrency(info.minSellPrice)}</Td>
                      <Td>{info.minSellPrice === null ? '-' : formatCurrency(info.maxSellPrice)}</Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td>No Data</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Card>
  );
};

export default TableInvestmentInfoByAsset;
