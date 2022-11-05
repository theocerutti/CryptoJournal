import React from 'react';

export default function ChartTotalInvested() {
  return <div></div>;
  // const [lineChartData, setData] = useState<{ name: string; data: any[] }[]>([
  //   {
  //     name: 'Total Invested',
  //     data: [],
  //   },
  // ]);
  //
  // const [loadingCalculation, setLoadingCalculation] = useState(true);
  //
  // const queries = useQueries({
  //   queries: [
  //     {
  //       queryKey: [TRANSACTION_QUERY_KEY],
  //       queryFn: getTransactionsQuery,
  //       ...defaultQueryConfig,
  //     },
  //     {
  //       queryKey: [INVESTMENT_GLOBAL_INFO_QUERY_KEY],
  //       queryFn: getInvestmentsGlobalInfoQuery,
  //       ...defaultQueryConfig,
  //     },
  //   ],
  // });
  //
  // const isSuccess = queries.every((query) => query.isSuccess);
  // const isError = queries.find((query) => query.isError);
  // const dataTransactions = queries[0].data;
  // const dataGlobalInfo = queries[1].data;
  //
  // useEffect(() => {
  //   if (isSuccess) {
  //     setLoadingCalculation(true);
  //     let chartData = lineChartData;
  //     chartData[0].data = dataTransactions.data
  //       .map((transac: GetTransactionDto) => {
  //         // @ts-ignore
  //         return [Date.parse(new Date(transac.date))];
  //       })
  //       .sort((a, b) => a[0] - b[0]);
  //     let amount = 0;
  //     for (let i = 0; i < dataTransactions.data.length; i++) {
  //       const transaction: GetTransactionDto = dataTransactions.data[i];
  //       if (transaction.fromBank) {
  //         amount += transaction.amount;
  //       } else if (transaction.toBank) {
  //         amount -= transaction.amount;
  //       }
  //       chartData[0].data[i].push(amount);
  //     }
  //     chartData[0].data.unshift([chartData[0].data[0][0] - 86400000, 0]); // add 0$ dot in the chart
  //     setData(chartData);
  //     setLoadingCalculation(false);
  //   }
  // }, [isSuccess, dataTransactions, lineChartData]);
  //
  // if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;
  // if (loadingCalculation) return <CenteredSpinner />;
  //
  // return (
  //   <LineChart
  //     chartId='line-chart-total-invested'
  //     resetTooltipValue={dataGlobalInfo.data.totalInvested}
  //     canZoom={true}
  //     data={lineChartData}
  //     tooltipTitle='Total Invested'
  //     height={300}
  //   />
  // );
}
