import React from 'react';

const TransactionsContainer = () => {
  return <div></div>;
  // const history = useHistory();
  // const queryClient = useQueryClient();
  // const { data, isError, isLoading, isSuccess } = useQuery([TRANSACTION_QUERY_KEY], getTransactionsQuery, {
  //   ...defaultQueryConfig,
  // });
  //
  // const mutation = useMutation(deleteTransactionMutation, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
  //   },
  // });
  //
  // const handleDelete = (transactionID: number) => {
  //   mutation.mutate(transactionID);
  // };
  //
  // const handleEdit = (transaction: GetTransactionDto) => {
  //   history.push('/dashboard/edit-transaction', { transaction });
  // };
  //
  // if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;
  //
  // if (isLoading) return <CenteredSpinner />;
  //
  // if (isSuccess) {
  //   if (data.data.length === 0) return <NoTransactions />;
  //
  //   return <TransactionTable transactions={data.data} handleDelete={handleDelete} handleEdit={handleEdit} />;
  // }
};

export default TransactionsContainer;
