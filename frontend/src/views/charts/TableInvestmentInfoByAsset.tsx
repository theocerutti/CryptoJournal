import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getInvestmentsGlobalInfoQuery,
  INVESTMENT_GLOBAL_INFO_QUERY_KEY,
} from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import {
  Alert,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Card from '../../components/card/Card';

const TableInvestmentInfoByAsset = () => {
  const { data, isError, isLoading } = useQuery(
    [INVESTMENT_GLOBAL_INFO_QUERY_KEY],
    getInvestmentsGlobalInfoQuery,
    {
      ...defaultQueryConfig,
    }
  );

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (isLoading) return <Spinner />;

  const infoByName = data.data.infoByName;

  return (
    <Card>
      <Flex flexDirection='column'>
        <Heading as='h1' size='lg'>
          Investment Info By Asset
        </Heading>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Td>NAME</Td>
                {Object.keys(infoByName['BTC']).map((name) => (
                  <Td>{name.toUpperCase()}</Td>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(infoByName).map((name) => (
                <Tr>
                  <Td>{name}</Td>
                  {Object.values(infoByName[name]).map((value) => (
                    <Td>{value}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Card>
  );
};

export default TableInvestmentInfoByAsset;
