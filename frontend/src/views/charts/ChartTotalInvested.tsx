import { Alert } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  getInvestmentsGlobalInfoQuery,
  getInvestmentsQuery,
  INVESTMENT_GLOBAL_INFO_QUERY_KEY,
  INVESTMENT_QUERY_KEY,
} from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import { GetInvestmentDto } from '@shared/investment';
import LineChart from '../../components/charts/LineChart';
import CenteredSpinner from '../../components/CenteredSpinner';

export default function ChartTotalInvested() {
  const [lineChartData, setData] = useState<{ name: string; data: any[] }[]>([
    {
      name: 'Total Invested',
      data: [],
    },
  ]);

  const [loadingCalculation, setLoadingCalculation] = useState(true);

  const queries = useQueries({
    queries: [
      {
        queryKey: [INVESTMENT_QUERY_KEY],
        queryFn: getInvestmentsQuery,
        ...defaultQueryConfig,
      },
      {
        queryKey: [INVESTMENT_GLOBAL_INFO_QUERY_KEY],
        queryFn: getInvestmentsGlobalInfoQuery,
        ...defaultQueryConfig,
      },
    ],
  });

  const isSuccess = queries.every((query) => query.isSuccess);
  const isError = queries.find((query) => query.isError);
  const dataInvestments = queries[0].data;
  const dataGlobalInfo = queries[1].data;

  useEffect(() => {
    if (isSuccess) {
      setLoadingCalculation(true);
      let chartData = lineChartData;
      chartData[0].data = dataInvestments.data
        .map((investment: GetInvestmentDto) => {
          // @ts-ignore
          return [Date.parse(new Date(investment.buyDate))];
        })
        .sort((a, b) => a[0] - b[0]);
      let amount = 0;
      for (let i = 0; i < dataInvestments.data.length; i++) {
        const investment: GetInvestmentDto = dataInvestments.data[i];
        amount += investment.investedAmount;
        chartData[0].data[i].push(amount);
      }
      setData(chartData);
      setLoadingCalculation(false);
    }
  }, [isSuccess, dataInvestments, lineChartData]);

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (loadingCalculation) return <CenteredSpinner />;

  return (
    <LineChart
      chartId='line-chart-total-invested'
      resetTooltipValue={dataGlobalInfo.data.totalInvested}
      canZoom={true}
      data={lineChartData}
      tooltipTitle='Total Invested'
      height={300}
    />
  );
}
