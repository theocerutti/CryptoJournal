import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  HStack,
  useColorModeValue,
  Icon,
  Text,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import Card from 'components/card/Card';
import { GetInvestmentDto } from '@shared/investment';
import { MdDelete, MdEdit, MdUpgrade } from 'react-icons/md';
import { formatCurrency } from '../../utils/format';
import { getSign } from '../../utils/math';

const InvestmentTable = ({
  investments,
  handleDelete,
  handleEdit,
}: {
  investments: GetInvestmentDto[];
  handleDelete: (investment: GetInvestmentDto) => void;
  handleEdit: (investment: GetInvestmentDto) => void;
}) => {
  const textColorSecondary = 'secondaryGray.600';

  const getGrowthColor = (value: number) => {
    if (value === 0) return textColorSecondary;
    return value > 0 ? 'green.500' : 'red.500';
  };

  const columnsDataComplex = [
    {
      Header: 'NAME',
      accessor: 'name',
    },
    {
      Header: 'PRICE',
      accessor: 'price',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'PNL',
      accessor: 'pnl',
      Cell: ({ value, row }: { value: number; row: any }) => (
        <Flex align='center'>
          <Text
            color={getGrowthColor(value)}
            fontSize='xs'
            fontWeight='700'
            me='5px'
          >
            {getSign(value)}
            {formatCurrency(Math.abs(value))} (
            {row.original.pnlPercent?.toFixed(2)}%)
          </Text>
        </Flex>
      ),
    },
    {
      Header: 'BALANCE',
      accessor: 'total',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'INVESTED AMOUNT',
      accessor: 'investedAmount',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'HOLDINGS',
      accessor: 'holdings',
    },
    {
      Header: 'BUY PRICE',
      accessor: 'buyPrice',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'BUY DATE',
      accessor: 'buyDate',
      Cell: ({ value }: { value: string }) =>
        value ? new Date(value).toLocaleDateString() : '--',
    },
    {
      Header: 'SELL PRICE',
      accessor: 'sellPrice',
      Cell: ({ value }: { value: number }) =>
        value ? formatCurrency(value) : '--',
    },
    {
      Header: 'SELL DATE',
      accessor: 'sellDate',
      Cell: ({ value }: { value: string }) =>
        value ? new Date(value).toLocaleDateString() : '--',
    },
    {
      Header: 'FEES',
      accessor: 'fees',
      Cell: ({ value }: { value: number }) =>
        value !== 0 ? formatCurrency(value) : '--',
    },
    {
      Header: 'LOCATION NAME',
      accessor: 'locationName',
    },
    {
      Header: 'PRICE LINK',
      accessor: 'priceLink',
    },
    {
      id: 'actions',
      Cell: () => (
        <HStack>
          <Button colorScheme='yellow' variant='ghost'>
            <Icon as={MdEdit} />
          </Button>
          <Button colorScheme='red' variant='ghost'>
            <Icon as={MdDelete} />
          </Button>
        </HStack>
      ),
    },
  ];

  const columns = useMemo(() => columnsDataComplex, []);
  const data = useMemo(() => investments, [investments]);

  const tableInstance = useTable(
    {
      // @ts-ignore
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;

  initialState.pageSize = 5;

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card
      flexDirection='column'
      w='100%'
      px='0px'
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'
                  >
                    {column.render('Header')}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = cell.value;
                  // if (cell.column.Header === 'NAME') {
                  //   data = (
                  //     <Text color={textColor} fontSize='sm' fontWeight='700'>
                  //       {cell.value}
                  //     </Text>
                  //   );
                  // } else if (cell.column.Header === 'STATUS') {
                  //   data = (
                  //     <Flex align='center'>
                  //       <Icon
                  //         w='24px'
                  //         h='24px'
                  //         me='5px'
                  //         color={
                  //           cell.value === 'Approved'
                  //             ? 'green.500'
                  //             : cell.value === 'Disable'
                  //             ? 'red.500'
                  //             : cell.value === 'Error'
                  //             ? 'orange.500'
                  //             : null
                  //         }
                  //         as={
                  //           cell.value === 'Approved'
                  //             ? MdCheckCircle
                  //             : cell.value === 'Disable'
                  //             ? MdCancel
                  //             : cell.value === 'Error'
                  //             ? MdOutlineError
                  //             : null
                  //         }
                  //       />
                  //       <Text color={textColor} fontSize='sm' fontWeight='700'>
                  //         {cell.value}
                  //       </Text>
                  //     </Flex>
                  //   );
                  // } else if (cell.column.Header === 'DATE') {
                  //   data = (
                  //     <Text color={textColor} fontSize='sm' fontWeight='700'>
                  //       {cell.value}
                  //     </Text>
                  //   );
                  // } else if (cell.column.Header === 'PROGRESS') {
                  //   data = (
                  //     <Flex align='center'>
                  //       <Progress
                  //         variant='table'
                  //         colorScheme='brandScheme'
                  //         h='8px'
                  //         w='108px'
                  //         value={cell.value}
                  //       />
                  //     </Flex>
                  //   );
                  // }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor='transparent'
                      color={textColor}
                      //fontSize='sm'
                      fontWeight='700'
                    >
                      {cell.render('Cell')}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
};

export default InvestmentTable;
