import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentsQuery, INVESTMENT_QUERY_KEY } from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import { Alert } from '@chakra-ui/react';
import PieChart from '../../components/charts/PieChart';
import { GetInvestmentDto } from '@shared/investment';
import CenteredSpinner from '../../components/CenteredSpinner';

const ChartInvestmentStatus = () => {
  const [chartData, setData] = useState<{ [label: string]: number }>({});
  const [loadingCalculation, setLoadingCalculation] = useState(true);
  const { data, isError, isSuccess } = useQuery([INVESTMENT_QUERY_KEY], getInvestmentsQuery, {
    ...defaultQueryConfig,
  });

  useEffect(() => {
    if (isSuccess) {
      setLoadingCalculation(true);
      const updatedChartData = {} as { [key: string]: number };
      for (let i = 0; i < data.data.length; i++) {
        const investment = data.data[i] as GetInvestmentDto;
        const name = `${investment.name} ${investment.orderStatus} ${investment.type}`;
        if (updatedChartData[name]) {
          updatedChartData[name] += 1;
        } else {
          updatedChartData[name] = 1;
        }
      }
      setData(updatedChartData);
      setLoadingCalculation(false);
    }
  }, [isSuccess]);

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (loadingCalculation) return <CenteredSpinner />;

  return <PieChart title='Investment status by asset' chartId='pie-chart-investment-info' data={chartData} />;
};

export default ChartInvestmentStatus;
