import React from 'react';

const InvestmentsContainer = () => {
  return <div></div>;
  // const toast = useToast();
  // const history = useHistory();
  // const queryClient = useQueryClient();
  // const { data, isError, isLoading, isSuccess } = useQuery([INVESTMENT_QUERY_KEY], getInvestmentsQuery, {
  //   ...defaultQueryConfig,
  // });
  //
  // const mutation = useMutation(deleteInvestmentMutation, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
  //     showToast(toast, 'Investment deleted successfully', 'success');
  //   },
  // });
  //
  // const handleDelete = (investmentID: number) => {
  //   mutation.mutate(investmentID);
  // };
  //
  // const handleEdit = (investment: GetInvestmentDto) => {
  //   history.push('/dashboard/edit-investment', { investment });
  // };
  //
  // if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  //
  // if (isLoading) return <CenteredSpinner />;
  //
  // if (isSuccess) {
  //   if (data.data.length === 0) return <NoInvestments />;
  //
  //   return <InvestmentTable investments={data.data} handleDelete={handleDelete} handleEdit={handleEdit} />;
  // }
};

export default InvestmentsContainer;
