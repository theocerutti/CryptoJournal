import React from 'react';
import { GetTransactionDto } from '@shared/transaction';

const TransactionTable = ({
  transactions,
  handleDelete,
}: // handleEdit,
{
  transactions: GetTransactionDto[];
  handleDelete: (investmentID: number) => void;
  // handleEdit: (investment: GetInvestmentDto) => void;
}) => {
  return <div></div>;
  // const columns = [
  //   {
  //     Header: 'FROM/TO',
  //     accessor: 'from',
  //     Cell: ({ value, row }: { value: string; row: any }) => (
  //       <Flex align='center' width='100px'>
  //         <span style={{ paddingRight: '8px' }}>{value}</span>
  //         <Icon w={5} h={5} as={BsArrowBarRight} />
  //         <span style={{ paddingLeft: '8px' }}>{row.original.to}</span>
  //       </Flex>
  //     ),
  //   },
  //   {
  //     Header: 'AMOUNT',
  //     accessor: 'amount',
  //     Cell: ({ value }: { value: number }) => formatCurrency(value),
  //   },
  //   {
  //     Header: 'DATE',
  //     accessor: 'date',
  //     Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString(),
  //   },
  //   {
  //     Header: 'FEES',
  //     accessor: 'fees',
  //     Cell: ({ value }: { value: number }) => (value !== 0 ? formatCurrency(value) : '--'),
  //   },
  //   {
  //     id: 'actions',
  //     Cell: ({ row }: { row: { original: GetInvestmentDto } }) => (
  //       <HStack justify={'end'}>
  //         <Button onClick={() => handleEdit(row.original)} colorScheme='yellow' variant='ghost'>
  //           <Icon as={MdEdit} />
  //         </Button>
  //         <Button onClick={() => handleDelete(row.original.id)} colorScheme='red' variant='ghost'>
  //           <Icon as={MdDelete} />
  //         </Button>
  //       </HStack>
  //     ),
  //   },
  // ];
  //
  // return <Table data={transactions} columns={columns} />;
};

export default TransactionTable;
