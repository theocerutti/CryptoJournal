import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getTransactionsQuery, TRANSACTION_QUERY_KEY } from '../../queries/transaction';
import { defaultQueryConfig } from '../../queries/config';
import { getGlobalInfoQuery, GLOBAL_INFO_QUERY_KEY } from '../../queries/global-info';
import { GetTransactionDto } from '@shared/transaction';
import { Alert } from '@chakra-ui/react';
import CenteredSpinner from '../../components/CenteredSpinner';
import LineChart from '../../components/charts/LineChart';

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
        queryKey: [TRANSACTION_QUERY_KEY],
        queryFn: getTransactionsQuery,
        ...defaultQueryConfig,
      },
      {
        queryKey: [GLOBAL_INFO_QUERY_KEY],
        queryFn: getGlobalInfoQuery,
        ...defaultQueryConfig,
      },
    ],
  });

  const isSuccess = queries.every((query) => query.isSuccess);
  const isError = queries.find((query) => query.isError);
  const dataTransactions = queries[0].data;
  const dataGlobalInfo = queries[1].data;

  useEffect(() => {
    if (isSuccess) {
      setLoadingCalculation(true);
      let chartData = lineChartData;
      chartData[0].data = dataTransactions.data
        .map((transac: GetTransactionDto) => {
          // @ts-ignore
          return [Date.parse(new Date(transac.date))];
        })
        .sort((a, b) => a[0] - b[0]);
      let amount = 0;
      for (let i = 0; i < dataTransactions.data.length; i++) {
        const transaction: GetTransactionDto = dataTransactions.data[i];
        if (transaction.from.portfolio.isMyBank) amount += transaction.from.price * transaction.from.amount;
        if (transaction.to.portfolio.isMyBank) amount -= transaction.to.price * transaction.to.amount;

        console.log(amount);
        chartData[0].data[i].push(amount);
      }
      chartData[0].data.unshift([chartData[0].data[0][0] - 86400000, 0]); // add 0$ dot in the chart
      setData(chartData);
      setLoadingCalculation(false);
    }
  }, [isSuccess, dataTransactions, lineChartData]);

  if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;
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
