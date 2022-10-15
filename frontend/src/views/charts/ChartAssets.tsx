import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getInvestmentsQuery,
  INVESTMENT_QUERY_KEY,
} from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import { Alert, Spinner } from '@chakra-ui/react';
import PieChart from '../../components/charts/PieChart';
import { GetInvestmentDto } from '@shared/investment';

const ChartAssets = () => {
  const [chartData, setData] = useState<{ [label: string]: number }>({});
  const [loadingCalculation, setLoadingCalculation] = useState(true);
  const { data, isError, isLoading, isSuccess } = useQuery(
    [INVESTMENT_QUERY_KEY],
    getInvestmentsQuery,
    {
      ...defaultQueryConfig,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setLoadingCalculation(true);
      const updatedChartData = {} as { [key: string]: number };
      for (let i = 0; i < data.data.length; i++) {
        const investment = data.data[i] as GetInvestmentDto;
        if (updatedChartData[investment.name]) {
          updatedChartData[investment.name] += 1;
        } else {
          updatedChartData[investment.name] = 1;
        }
      }
      setData(updatedChartData);
      setLoadingCalculation(false);
    }
  }, [isSuccess, data, chartData]);

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (loadingCalculation) return <Spinner />;

  return (
    <PieChart
      title='Number of investments by asset'
      chartId='pie-chart-assets'
      data={chartData}
    />
  );
};

export default ChartAssets;
