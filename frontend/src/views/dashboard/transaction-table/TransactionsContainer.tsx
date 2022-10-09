import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteTransactionMutation,
  getTransactionsQuery,
  TRANSACTION_QUERY_KEY,
} from '../../../queries/transactions';
import { Alert, Flex, Spinner } from '@chakra-ui/react';
import NoTransactions from './NoTransactions';
import { defaultQueryConfig } from 'queries/config';
import TransactionTable from './TransactionTable';
import { useHistory } from 'react-router-dom';
import { INVESTMENT_QUERY_KEY } from '../../../queries/investments';
import { GetTransactionDto } from '@shared/transaction';

const TransactionsContainer = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data, isError, isLoading, isSuccess } = useQuery(
    [TRANSACTION_QUERY_KEY],
    getTransactionsQuery,
    {
      ...defaultQueryConfig,
    }
  );

  const mutation = useMutation(deleteTransactionMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
    },
  });

  const handleDelete = (transactionID: number) => {
    mutation.mutate(transactionID);
  };

  const handleEdit = (transaction: GetTransactionDto) => {
    history.push('/dashboard/edit-transaction', { transaction });
  };

  if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;

  if (isLoading)
    return (
      <Flex justify='center'>
        <Spinner />
      </Flex>
    );

  if (isSuccess) {
    if (data.data.length === 0) return <NoTransactions />;

    return (
      <TransactionTable
        transactions={data.data}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    );
  }
};

export default TransactionsContainer;
