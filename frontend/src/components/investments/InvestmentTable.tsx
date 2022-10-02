import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import React, { useMemo } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import Card from 'components/card/Card';
import { GetInvestmentDto } from '@shared/investment';
import { MdDelete, MdEdit } from 'react-icons/md';
import { formatCurrency } from '../../utils/format';
import { getSign } from '../../utils/math';

const InvestmentTable = ({
  investments,
  handleDelete,
  handleEdit,
}: {
  investments: GetInvestmentDto[];
  handleDelete: (investmentID: number) => void;
  handleEdit: (investment: GetInvestmentDto) => void;
}) => {
  const textColorSecondary = 'secondaryGray.600';

  const getGrowthColor = (value: number) => {
    if (value === 0) return textColorSecondary;
    return value > 0 ? 'green.500' : 'red.500';
  };

  const paginationIndex = [10, 20, 30, 40, 50]; // null = all
  const columns = useMemo(
    () => [
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
    [handleDelete, handleEdit]
  );

  const data = useMemo(() => investments, [investments]);

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
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

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
      <Flex justifyContent='space-between' m={4} alignItems='center'>
        <Flex>
          <Tooltip label='First Page'>
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
              aria-label={'First Page'}
            />
          </Tooltip>
          <Tooltip label='Previous Page'>
            <IconButton
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
              aria-label={'Previous Page'}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems='center'>
          <Text flexShrink={0} mr={8}>
            Page{' '}
            <Text fontWeight='bold' as='span'>
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight='bold' as='span'>
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink={0}>Go to page:</Text>
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value: string) => {
              const pageNumber = value ? Number(value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {paginationIndex.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label='Next Page'>
            <IconButton
              onClick={nextPage}
              isDisabled={!canNextPage}
              aria-label='NextPage'
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label='Last Page'>
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
              aria-label='Last Page'
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  );
};

export default InvestmentTable;
