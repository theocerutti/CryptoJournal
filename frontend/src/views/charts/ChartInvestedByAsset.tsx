import React from 'react';

const ChartInvestedByAsset = () => {
  return <div></div>;
  // const [chartData, setData] = useState<{ [label: string]: number }>({});
  // const [loadingCalculation, setLoadingCalculation] = useState(true);
  // const { data, isError, isSuccess } = useQuery([INVESTMENT_QUERY_KEY], getInvestmentsQuery, {
  //   ...defaultQueryConfig,
  // });
  //
  // useEffect(() => {
  //   if (isSuccess) {
  //     setLoadingCalculation(true);
  //     const updatedChartData = {} as { [key: string]: number };
  //     for (let i = 0; i < data.data.length; i++) {
  //       const investment = data.data[i] as GetInvestmentDto;
  //       if (updatedChartData[investment.name]) {
  //         updatedChartData[investment.name] += investment.investedAmount;
  //       } else {
  //         updatedChartData[investment.name] = investment.investedAmount;
  //       }
  //     }
  //     setData(updatedChartData);
  //     setLoadingCalculation(false);
  //   }
  // }, [isSuccess]);
  //
  // if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  // if (loadingCalculation) return <CenteredSpinner />;
  //
  // return (
  //   <PieChart
  //     title='Total invested by asset'
  //     chartId='pie-chart-invested-by-asset'
  //     shouldFormatCurrency
  //     data={chartData}
  //   />
  // );
};

export default ChartInvestedByAsset;
