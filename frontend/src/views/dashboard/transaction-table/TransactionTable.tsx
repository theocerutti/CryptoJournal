import { Button, HStack, Icon } from '@chakra-ui/react';
import Table from 'components/table/Table';
import React from 'react';
import { GetInvestmentDto } from '@shared/investment';
import { MdDelete, MdEdit } from 'react-icons/md';
import { formatCurrency } from '../../../utils/format';
import { GetTransactionDto } from '@shared/transaction';

const TransactionTable = ({
                            transactions,
                            handleDelete,
                            handleEdit,
                          }: {
  transactions: GetTransactionDto[];
  handleDelete: (investmentID: number) => void;
  handleEdit: (investment: GetInvestmentDto) => void;
}) => {
  const columns = [
    {
      Header: 'AMOUNT',
      accessor: 'amount',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'FROM',
      accessor: 'from',
    },
    {
      Header: 'TO',
      accessor: 'to',
    },
    {
      Header: 'DATE',
      accessor: 'date',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: 'FEES',
      accessor: 'fees',
      Cell: ({ value }: { value: number }) =>
        value !== 0 ? formatCurrency(value) : '--',
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
  ];

  return (
    <Table data={transactions} columns={columns} />
  );
};

export default TransactionTable;
