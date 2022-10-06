import {
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Stat,
  StatHelpText,
  StatLabel,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import React, { useMemo } from 'react';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import Card from 'components/card/Card';
import { GetInvestmentDto } from '@shared/investment';
import { MdDelete, MdEdit } from 'react-icons/md';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { formatCurrency } from '../../../utils/format';
import { getSign } from '../../../utils/math';
import {
  MultiCheckBoxColumnFilter,
  multiSelectFilterType,
} from '../../../components/table/MultiCheckBoxColumnFilter';
import InvestmentTablePaginationFooter from './InvestmentTablePaginationFooter';

export enum InvestmentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

const InvestmentTable = ({
  investments,
  handleDelete,
  handleEdit,
}: {
  investments: GetInvestmentDto[];
  handleDelete: (investmentID: number) => void;
  handleEdit: (investment: GetInvestmentDto) => void;
}) => {
  const investmentStatusOpenColor = useColorModeValue('green.500', 'green.500');
  const investmentStatusClosedColor = useColorModeValue(
    'orange.500',
    'orange.500'
  );
  const textColorSecondary = 'secondaryGrey.600';

  const getGrowthColor = (value: number) => {
    if (value === 0) return textColorSecondary;
    return value > 0 ? 'green.500' : 'red.500';
  };

  const columns = useMemo(
    () => [
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({ value }: { value: InvestmentStatus }) => (
          <Tooltip label={value} placement='top'>
            <Flex width='100%' justify='center'>
              <Icon
                color={
                  value === InvestmentStatus.OPEN
                    ? investmentStatusOpenColor
                    : investmentStatusClosedColor
                }
                as={RiCheckboxBlankCircleFill}
              />
            </Flex>
          </Tooltip>
        ),
      },
      {
        Header: 'NAME',
        accessor: 'name',
        Cell: ({ value, row }: { value: string; row: any }) => (
          <Stat>
            <StatLabel>{value}</StatLabel>
            {row.original.status === InvestmentStatus.OPEN && (
              <StatHelpText fontSize='12px'>
                {formatCurrency(row.original.price)}
              </StatHelpText>
            )}
          </Stat>
        ),
        Filter: MultiCheckBoxColumnFilter,
        filter: 'multiSelect',
        disableSortBy: true,
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
        Header: 'HOLDINGS',
        accessor: 'holdings',
        Cell: ({ value }: { value: number }) => value.toFixed(3),
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
        Filter: MultiCheckBoxColumnFilter,
        filter: 'multiSelect',
        disableSortBy: true,
      },
      {
        Header: 'PRICE LINK',
        accessor: 'priceLink',
        Cell: ({ value }: { value: string }) => (
          <Link href={value}>{value}</Link>
        ),
      },
      {
        id: 'actions',
        Cell: ({ row }: { row: { original: GetInvestmentDto } }) => (
          <HStack>
            <Button
              onClick={() => handleEdit(row.original)}
              colorScheme='yellow'
              variant='ghost'
            >
              <Icon as={MdEdit} />
            </Button>
            <Button
              onClick={() => handleDelete(row.original.id)}
              colorScheme='red'
              variant='ghost'
            >
              <Icon as={MdDelete} />
            </Button>
          </HStack>
        ),
      },
    ],
    [
      handleDelete,
      handleEdit,
      investmentStatusClosedColor,
      investmentStatusOpenColor,
    ]
  );

  const data = useMemo(() => investments, [investments]);

  const filterTypes = React.useMemo(
    () => ({
      multiSelect: multiSelectFilterType,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
      // @ts-ignore
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const textColor = useColorModeValue('secondaryGrey.900', 'white');
  const borderColor = useColorModeValue('grey.200', 'whiteAlpha.100');

  const showDefaultFilter = (column: any): JSX.Element => (
    <span>
      {column.isSorted ? (
        column.isSortedDesc ? (
          <ChevronDownIcon />
        ) : (
          <ChevronUpIcon />
        )
      ) : (
        ''
      )}
    </span>
  );

  return (
    <Card
      flexDirection='column'
      w='100%'
      px='0px'
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Table {...getTableProps()} variant='simple' color='grey.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => {
                return (
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
                      color='grey.400'
                    >
                      {column.render('Header')}

                      <div>
                        {column.canFilter && column.Filter
                          ? column.render('Filter')
                          : showDefaultFilter(column)}
                      </div>
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor='transparent'
                      color={textColor}
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
      <InvestmentTablePaginationFooter
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        setPageSize={setPageSize}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageSize={pageSize}
        investments={investments}
        nextPage={nextPage}
      />
    </Card>
  );
};

export default InvestmentTable;
