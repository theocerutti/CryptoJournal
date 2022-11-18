import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { deleteTransactionMutation, getTransactionsQuery, TRANSACTION_QUERY_KEY } from '../../../queries/transaction';
import { Alert, useToast } from '@chakra-ui/react';
import { GetTransactionDto } from '@shared/transaction';
import CenteredSpinner from '../../../components/CenteredSpinner';
import TransactionTable from './TransactionTable';
import { showToast } from '../../../utils/toast';
import NoDataTable from '../../../components/NoDataTable';
import { defaultQueryConfig } from '../../../queries/config';
import { CMC_CRYPTO_BASIC_INFOS, getCryptoBasicsInfos } from '../../../queries/coinmarketcap';

const TransactionsContainer = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const toast = useToast();
  const queries = useQueries({
    queries: [
      {
        queryKey: [TRANSACTION_QUERY_KEY],
        queryFn: getTransactionsQuery,
        ...defaultQueryConfig,
      },
      {
        queryKey: [CMC_CRYPTO_BASIC_INFOS],
        queryFn: getCryptoBasicsInfos,
        ...defaultQueryConfig,
      },
    ],
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

  const isSuccess = queries.every((query) => query.isSuccess);
  const isError = queries.find((query) => query.isError);
  const isLoading = queries.find((query) => query.isLoading);
  const dataTransactions = queries[0].data;
  const dataCryptoInfos = queries[1].data;

  if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;

  if (isLoading) return <CenteredSpinner />;

  if (isSuccess) {
    if (dataTransactions.data.length === 0)
      return <NoDataTable>You don't have any transactions yet. Add one to get started.</NoDataTable>;

    return (
      <TransactionTable
        transactions={dataTransactions.data}
        cryptoInfos={dataCryptoInfos.data}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    );
  }
};

export default TransactionsContainer;
