import { Alert, Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
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

export default function ChartFees() {
  const [lineChartData, setData] = useState<{ name: string; data: any[] }[]>([
    {
      name: 'Fees',
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
        amount += investment.fees;
        chartData[0].data[i].push(amount);
      }
      setData(chartData);
      setLoadingCalculation(false);
    }
  }, [isSuccess, dataInvestments, lineChartData]);

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (loadingCalculation) return <Spinner />;

  return (
    <LineChart
      chartId='line-chart-fees'
      resetTooltipValue={dataGlobalInfo.data.totalFees}
      canZoom={true}
      data={lineChartData}
      tooltipTitle='Total Fees'
      height={300}
    />
  );
}
