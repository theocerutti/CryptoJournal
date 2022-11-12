import React, { useMemo } from 'react';
import { GetTransactionDto } from '@shared/transaction';
import { Button, Flex, HStack, Icon, Stat, StatHelpText, StatNumber, Tooltip, VStack } from '@chakra-ui/react';
import { BsArrowBarRight } from 'react-icons/bs';
import { MdDelete, MdEdit, MdInfo } from 'react-icons/md';
import Table from '../../../components/table/Table';
import { toSpecialPrecision } from '../../../utils/math';

const TransactionTable = ({
  transactions,
  handleDelete,
  handleEdit,
}: {
  transactions: GetTransactionDto[];
  handleDelete: (transactionID: number) => void;
  handleEdit: (transaction: GetTransactionDto) => void;
}) => {
  const dateSort = useMemo(
    () => (rowA: any, rowB: any, columnId: any) => {
      const dateA = new Date(rowA.values[columnId]);
      const dateB = new Date(rowB.values[columnId]);
      return dateA.getTime() - dateB.getTime();
    },
    []
  );

  const columns = [
    {
      Header: 'DATE',
      accessor: 'date',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString(),
      sortType: dateSort,
    },
    {
      Header: 'PORTFOLIO',
      Cell: ({ row }: { row: { original: GetTransactionDto } }) => (
        <Flex align='center' width='100px'>
          <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}>{row.original.from.portfolio.name}</span>
          <Icon w={5} h={5} as={BsArrowBarRight} />
          <span style={{ whiteSpace: 'nowrap', paddingLeft: '8px' }}>{row.original.to.portfolio.name}</span>
        </Flex>
      ),
    },
    {
      Header: 'ASSET',
      Cell: ({ row }: { row: { original: GetTransactionDto } }) => (
        <Tooltip
          label={
            <VStack align='self-start'>
              <div>
                1 {row.original.from.asset.name} = {toSpecialPrecision(row.original.from.price)} USD
              </div>
              <div>
                1 {row.original.to.asset.name} = {toSpecialPrecision(row.original.to.price)} USD
              </div>
            </VStack>
          }
          placement='top'
        >
          <Flex align='center' width='100px'>
            <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}>
              {toSpecialPrecision(row.original.from.amount)} {row.original.from.asset.name}
            </span>
            <Icon w={5} h={5} as={BsArrowBarRight} />
            <span style={{ whiteSpace: 'nowrap', paddingLeft: '8px' }}>
              {toSpecialPrecision(row.original.to.amount)} {row.original.to.asset.name}
            </span>
          </Flex>
        </Tooltip>
      ),
    },
    {
      Header: 'FEES',
      Cell: ({ row }: { row: { original: GetTransactionDto } }) => (
        <Flex>
          <Stat size='sm'>
            <StatNumber>
              {toSpecialPrecision(row.original.feeAmount)} {row.original.feeAsset.name}
            </StatNumber>
            <StatHelpText style={{ fontSize: '12px' }}>
              (1 USD = {toSpecialPrecision(row.original.feePrice)} {row.original.feeAsset.name})
            </StatHelpText>
          </Stat>
        </Flex>
      ),
    },
    {
      id: 'actions',
      Cell: ({ row }: { row: { original: GetTransactionDto } }) => (
        <HStack justify={'end'}>
          <Tooltip label={row.original.note} placement='top'>
            <Button variant='ghost' cursor='initial'>
              <Icon as={MdInfo} />
            </Button>
          </Tooltip>
          <Button onClick={() => handleEdit(row.original)} colorScheme='yellow' variant='ghost'>
            <Icon as={MdEdit} />
          </Button>
          <Button onClick={() => handleDelete(row.original.id)} colorScheme='red' variant='ghost'>
            <Icon as={MdDelete} />
          </Button>
        </HStack>
      ),
    },
  ];

  return (
    <Table
      data={transactions}
      columns={columns}
      initialState={{
        sortBy: [{ id: 'date', desc: true }],
      }}
    />
  );
};

export default TransactionTable;
