import React from 'react';
import Investment from './Investment';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentsQuery } from '../../queries/investments';
import { Alert, Flex, Spinner } from '@chakra-ui/react';
import NoInvestments from './NoInvestments';

const InvestmentList = (props: any) => {
  const { data, isError, isLoading, isSuccess } = useQuery(
    ['investments'],
    getInvestmentsQuery
  );

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
          <Investment key={investment.id} investment={investment} />
        ))}
      </div>
    );
  }
};

export default InvestmentList;
