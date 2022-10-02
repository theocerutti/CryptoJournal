import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteInvestmentMutation,
  getInvestmentsQuery,
  INVESTMENT_QUERY_KEY,
} from '../../queries/investments';
import { Alert, Flex, Spinner } from '@chakra-ui/react';
import NoInvestments from './NoInvestments';
import { defaultQueryConfig } from 'queries/config';
import { GetInvestmentDto } from '@shared/investment';
import InvestmentTable from './InvestmentTable';
import { useHistory } from 'react-router-dom';

const InvestmentsContainer = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data, isError, isLoading, isSuccess } = useQuery(
    [INVESTMENT_QUERY_KEY],
    getInvestmentsQuery,
    {
      ...defaultQueryConfig,
    }
  );

  const mutation = useMutation(deleteInvestmentMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
    },
  });

  const handleDelete = (investmentID: number) => {
    mutation.mutate(investmentID);
  };

  const handleEdit = (investment: GetInvestmentDto) => {
    history.push('/dashboard/edit-investment', { investment });
  };

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;

  if (isLoading)
    return (
      <Flex justify='center'>
        <Spinner />
      </Flex>
    );

  if (isSuccess) {
    if (data.data.length === 0) return <NoInvestments />;

    return (
      <InvestmentTable
        investments={data.data}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    );
  }
};

export default InvestmentsContainer;
