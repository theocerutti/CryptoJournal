import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTransactionMutation, getTransactionsQuery, TRANSACTION_QUERY_KEY } from '../../../queries/transaction';
import { defaultQueryConfig } from '../../../queries/config';
import { Alert, useToast } from '@chakra-ui/react';
import { GetTransactionDto } from '@shared/transaction';
import CenteredSpinner from '../../../components/CenteredSpinner';
import NoTransactions from './NoTransactions';
import TransactionTable from './TransactionTable';
import { showToast } from '../../../utils/toast';

const TransactionsContainer = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isError, isLoading, isSuccess } = useQuery([TRANSACTION_QUERY_KEY], getTransactionsQuery, {
    ...defaultQueryConfig,
  });

  const mutation = useMutation(deleteTransactionMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([TRANSACTION_QUERY_KEY]);
    },
  });

  const handleDelete = (transactionID: number) => {
    mutation.mutate(transactionID);
    showToast(toast, 'Transaction deleted', 'success');
  };

  const handleEdit = (transaction: GetTransactionDto) => {
    history.push('/dashboard/edit-transaction', { transaction });
  };

  if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;

  if (isLoading) return <CenteredSpinner />;

  if (isSuccess) {
    if (data.data.length === 0) return <NoTransactions />;

    return <TransactionTable transactions={data.data} handleDelete={handleDelete} handleEdit={handleEdit} />;
  }
};

export default TransactionsContainer;
