import React from 'react';
import Investment from './Investment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteInvestmentMutation,
  getInvestmentsQuery,
  INVESTMENT_QUERY_KEY,
} from '../../queries/investments';
import { Alert, Flex, Spinner } from '@chakra-ui/react';
import NoInvestments from './NoInvestments';
import { defaultQueryConfig } from 'queries/config';
import { InvestmentDto } from '@shared/investment';

const InvestmentList = () => {
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

  const handleDelete = (investment: InvestmentDto) => {
    mutation.mutate(investment);
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
      <div>
        {data.data.map((investment: any) => (
          <Investment
            key={investment.id}
            investment={investment}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    );
  }
};

export default InvestmentList;
