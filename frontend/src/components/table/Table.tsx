import { Flex, Table as ChakraTable, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import React from 'react';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import Card from 'components/card/Card';
import { multiSelectFilterType } from 'components/table/MultiCheckBoxColumnFilter';
import TablePaginationFooter from 'components/table/TablePaginationFooter';

const Table = ({
                 columns,
                 data,
               }: {
  columns: any;
  data: any;
}) => {
  const filterTypes = React.useMemo(
    () => ({
      multiSelect: multiSelectFilterType,
    }),
    [],
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
    usePagination,
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
      <ChakraTable {...getTableProps()} variant='simple' color='grey.500' mb='24px'>
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
      </ChakraTable>
      <TablePaginationFooter
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        setPageSize={setPageSize}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageSize={pageSize}
        data={data}
        nextPage={nextPage}
      />
    </Card>
  );
};

export default Table;
