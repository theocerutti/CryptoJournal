import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

const TablePaginationFooter = ({
  gotoPage,
  canPreviousPage,
  previousPage,
  pageIndex,
  pageOptions,
  setPageSize,
  canNextPage,
  pageCount,
  pageSize,
  data,
  nextPage,
}: any) => {
  const [pageSizeAll, setPageSizeAll] = useState(false);
  const paginationIndex = [10, 20, 30, 40, 50, 'All'];

  return (
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
          value={pageSizeAll === true ? 'All' : pageSize}
          onChange={(e) => {
            if (e.target.value === 'All') {
              setPageSizeAll(true);
              setPageSize(data.length);
            } else {
              setPageSizeAll(false);
              setPageSize(Number(e.target.value));
            }
          }}
        >
          {paginationIndex.map((pageSize: any) => (
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
  );
};

export default TablePaginationFooter;
